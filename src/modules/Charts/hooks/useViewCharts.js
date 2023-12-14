import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useDataElements} from "./useDataElements";
import {useDataQuery} from "@dhis2/app-runtime";
import {FolderOutlined} from "@ant-design/icons";
import {Space} from "antd";
import styles from "../styles/ViewCharts.module.css";


const query = {
    events: {
        resource: "tracker/events",
        params: ({filter = "", date = "", program, orgUnit}) => ({
            program,
            orgUnit,
            fields: "dataValues,occurredAt,event,status,orgUnit,program,programType,updatedAt,createdAt,assignedUser",
            ouMode: "SELECTED",
            order: "createdAt:desc",
            occurredBefore: date,
            occurredAfter: date,
            filter
        })
    }
}


export const useViewCharts = () => {
    const [records, setRecords] = useState([])
    const [date, setDate] = useState(null)
    const [dateString, setDateString] = useState(null)
    const [ip, setIp] = useState(null)
    const [wards, setWards] = useState([])


    const navigate = useNavigate()

    const {program, dataElements: reduxDataElements} = useSelector(state => state.forms)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const {getDataElementByID, getDataElementByName} = useDataElements()


    const {loading, data, refetch} = useDataQuery(query)

    useEffect(() => {
        const wardElement = getDataElementByName("Ward (specialty)")

        const wardFolders = wardElement?.optionSet?.options?.map(option => ({
            ...option,
            icon: FolderOutlined,
            handler: () => filterByWards(option.code)
        }))

        if (wardFolders?.length > 0)
            setWards([...wardFolders, {
                displayName: "All Charts",
                code: "",
                icon: FolderOutlined,
                handler: () => filterByWards("")
            }])

    }, [reduxDataElements]);

    /**
     * Fetch data once org unit and program are loaded from redux store
     */
    useEffect(() => {
        refetch({
            orgUnit: orgUnitID,
            program
        })
    }, [orgUnitID, program]);

    /**
     * Table columns
     * @type {[{dataIndex: string, title: string, render: (function(*): unknown), key: string},{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, render: (function(): string), key: string},{dataIndex: string, title: string, render: (function(*, *): *), key: string}]}
     */
    const chartTableColumns = [
        {
            title: "Patient IP/OP NO.",
            dataIndex: "Patient IP/OP No.",
            key: "Patient IP/OP No.",
        },
        {
            title: "Ward",
            dataIndex: "Ward (specialty)",
            key: "Ward (specialty)",
            render: (text, record) => {
                const wardDataElement = getDataElementByName("Ward (specialty)")
                return wardDataElement.optionSet.options.find(option => option?.code === record["Ward (specialty)"])?.displayName
            }
        },
        {
            title: "Date Added",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => new Date(record.createdAt).toLocaleDateString()
        },
        {
            title: "Actions",
            dataIndex: "Actions",
            key: "event",
            render: (text, record) => (
                <Space size="large">
                    <div
                        onClick={() => navigate(`/charts/new-form/${record.eventUid}`)}
                        className={styles.addLink}>edit
                    </div>
                    <div
                        onClick={() => navigate(`/charts/event/${record.eventUid}`)}
                        className={styles.addLink}>View
                    </div>
                </Space>
            )
        }

    ]


    /**
     * Load table data once event data is fetched
     */
    useEffect(() => {
        setRecords(data?.events?.instances?.flatMap(instance => {
            const instanceObject = {
                createdAt: instance.createdAt,
                eventUid: instance.event
            }

            instance.dataValues.forEach(dataValue => {
                const dataElement = getDataElementByID(dataValue?.dataElement)
                instanceObject[dataElement?.displayName] = dataValue.value
            })

            return instanceObject

        }))
    }, [data]);


    const filterByIp = async () => {
        if (ip)
            await refetch({
                filter: `${getDataElementByName("ip/op").id}:ILIKE:${ip}`
            })
    }

    const filterByDate = async () => {
        if (dateString)
            await refetch({
                date: dateString
            })
    }

    const filterByWards = async (wardCode) => {
        setIp(null)
        setDate(null)
        setDateString(null)
        if (wardCode === "")
            await refetch({
                filter: ""
            })
        else
            await refetch({
                filter: `${getDataElementByName("Ward (specialty)").id}:ILIKE:${wardCode}`
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

    return {
        records,
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