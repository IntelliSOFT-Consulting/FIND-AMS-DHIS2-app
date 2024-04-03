import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useDataElements} from "./useDataElements";
import {useDataQuery} from "@dhis2/app-runtime";
import {FolderOutlined} from "@ant-design/icons";
import {Space} from "antd";
import styles from "../styles/ViewCharts.module.css";
import {useEntities} from "./useEntities";


const query = {
    events: {
        resource: "trackedEntityInstances.json",
        params: ({filter = "", date = "", program}) => ({
            program,
            fields: "trackedEntityInstance,trackedEntityType, attributes[*],enrollments[*],createdAt",
            ouMode: "ALL",
            pageSize: 50,
            order: "createdAt:desc",
            filter
        })
    }
}


export const useViewCharts = () => {
    const [date, setDate] = useState(null)
    const [dateString, setDateString] = useState(null)
    const [ip, setIp] = useState(null)
    const [wards, setWards] = useState([])
    const [patientData, setPatientData] = useState([])

    const navigate = useNavigate()

    const {dataElements: reduxDataElements} = useSelector(state => state.forms)
    const crr = useSelector(state => state.crr)

    const {getDataElementByName} = useDataElements()
    const {getEntityByName} = useEntities()

    const {refetch, data, loading} = useDataQuery(query)

    useEffect(() => {
        if (data) {
            const formattedPatientData = data?.events?.trackedEntityInstances.map(instance => ({
                "patientIP": (instance.enrollments[0]?.attributes.find(attribute => attribute.displayName.toLowerCase().includes("ip")))?.value,
                "ward": (instance.enrollments[0]?.attributes.find(attribute => attribute.displayName.toLowerCase().includes("ward")))?.value,
                "date": (instance.enrollments[0]?.attributes.find(attribute => attribute.displayName.toLowerCase().includes("date")))?.value,
                "teiID": instance.trackedEntityInstance,
                "enrollmentID": instance.enrollments[0]?.enrollment
            }))
            setPatientData(formattedPatientData)
        }
    }, [data]);

    /**
     * Table columns
     * @type {[{dataIndex: string, title: string, render: (function(*): unknown), key: string},{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, render: (function(): string), key: string},{dataIndex: string, title: string, render: (function(*, *): *), key: string}]}
     */
    const chartTableColumns = [
        {
            title: "Patient IP/OP NO.",
            dataIndex: "patientIP",
            key: "patientIP",
        },
        {
            title: "Ward",
            dataIndex: "ward",
            key: "ward",
            render: (text, record) => crr?.registration?.sections?.find(section => section?.title?.toLowerCase()?.includes("patients"))?.dataElements?.find(dataElement => dataElement?.name?.toLowerCase()?.includes("ward"))?.optionSet?.options?.find(option => option?.code === record?.ward)?.displayName

        },
        {
            title: "Date Added",
            dataIndex: "date",
            key: "date",
            render: (text, record) => new Date(record.date).toLocaleDateString()
        },
        {
            title: "Actions",
            dataIndex: "Actions",
            key: "event",
            render: (text, record) => (
                <Space size="large">
                    <div
                        onClick={() => navigate(`/crr/form/${record.teiID}/${record.enrollmentID}`)}
                        className={styles.addLink}>edit
                    </div>
                    <div
                        onClick={() => navigate(`/crr/trackedEntity/${record.teiID}`)}
                        className={styles.addLink}>View
                    </div>
                </Space>
            )
        }

    ]


    const filterByIp = async () => {
        if (ip)
            await refetch({
                filter: `${getEntityByName("ip").id}:ILIKE:${ip}`
            })
    }

    const filterByDate = async () => {
        if (dateString)
            await refetch({
                filter: `${getEntityByName("date").id}:ILIKE:${dateString}`
            })
    }

    const filterByWards = async (wardCode) => {
        setIp(null)
        setDate(null)
        setDateString(null)

        const wardEntity = getEntityByName("Ward (specialty)")

        if (wardCode === "" || !wardEntity)
            await refetch({
                filter: ""
            })
        else
            await refetch({
                filter: `${wardEntity.id}:ILIKE:${wardCode}`
            })
    }

    const clearFilters = async () => {
        await refetch({filter: "", date: ""})
        setDateString(null)
        setDate(null)
        setIp(null)
    }


    const handleDateChange = (date, dateString) => {
        setDate(date)
        setDateString(dateString)
    }

    const handleIpNoChange = (evt) => {
        setIp(evt.target.value)
    }


    useEffect(() => {
        refetch({
            program: crr?.program
        })
    }, [crr]);


    useEffect(() => {
        const wardEntity = getDataElementByName("ward")

        console.log('options', wardEntity?.optionSet?.options)
        const wardFolders = wardEntity?.optionSet?.options?.map(option => ({
            ...option,
            icon: FolderOutlined,
            handler: () => filterByWards(option.code)
        })).sort((a, b) => a.code.localeCompare(b.code, 'en', {sensitivity: 'base'}))

        if (wardFolders?.length > 0)
            setWards([...wardFolders, {
                displayName: "All Charts",
                code: "",
                icon: FolderOutlined,
                handler: () => filterByWards("")
            }])

    }, [reduxDataElements]);


    return {
        patientData,
        date,
        dateString,
        ip,
        wards,
        loading,
        chartTableColumns,
        filterByIp,
        filterByDate,
        filterByWards,
        clearFilters,
        handleDateChange,
        handleIpNoChange
    }


}