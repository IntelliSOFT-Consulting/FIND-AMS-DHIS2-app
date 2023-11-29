import {useEffect, useState} from "react";
import {FolderOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {useDataElements} from "./useDataElements";

const query = {
    events: {
        resource: "tracker/events",
        params: ({filter = "", program, orgUnitID}) => ({
            program,
            orgUnit: orgUnitID,
            fields: "dataValues,occurredAt,event,status,orgUnit,program,programType,updatedAt,createdAt,assignedUser",
            order: "occurredAt:desc",
            filter,
        })
    }
}

export const useListing = () => {
    const [searchString, setSearchString] = useState("")

    const [categories, setCategories] = useState([])

    const [loading, setLoading] = useState(false)

    const [records, setRecords] = useState([])

    const {program} = useSelector(state => state.microbiology)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const navigate = useNavigate()


    const {getDataElementByID, getDataElementByName} = useDataElements()


    const {data, refetch} = useDataQuery(query)

    const tableColumns = [
        {
            title: 'DOCUMENT NAME',
            dataIndex: 'Rename file',
            key: 'Rename file',
        },
        {
            title: 'ADDED BY',
            dataIndex: 'createdBy',
            key: 'createdBy',
        },
        {
            title: 'DATE ADDED',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, record) => new Date(record.createdAt).toLocaleDateString()
        },

    ]

    const handleSearch = async () => {
        await refetch({
            filter: `${getDataElementByName("Rename").id}:ILIKE:${searchString}`
        })
    }

    const handleChange = async (evt) => {
        setSearchString(evt.target.value)

        if (evt.target.value === "")
            await refetch({filter: ""})
    }

    useEffect(() => {

        setCategories(
            [
                {
                    displayName: "Passed",
                    code: "",
                    icon: FolderOutlined,
                    handler: () => navigate(`/microbiology-data`)
                },
                {
                    displayName: "Failed",
                    code: "",
                    icon: FolderOutlined,
                    handler: () => navigate(`/microbiology-data`)
                },
                {
                    displayName: "All Files",
                    code: "",
                    icon: FolderOutlined,
                    handler: () => navigate(`/microbiology-data`)
                },
            ]
        )

    }, []);

    useEffect(() => {

        if (data?.events?.instances?.length > 0) {

            const array = []

            data?.events?.instances?.forEach(instance => {
                let item = {
                    createdAt: instance.createdAt,
                    eventID: instance.event,
                }

                instance.dataValues.forEach(dataValue => {
                    const dataElementObject = getDataElementByID(dataValue?.dataElement)
                    item[dataElementObject?.displayName] = dataValue?.value
                })

                array.push(item)

            })

            setRecords(array)

        }

        return () => {
            setRecords([])
        }

    }, [data]);

    useEffect(() => {

        if (orgUnitID && program)
            refetch({program, orgUnitID})

        return () => {
            setRecords([])
        }

    }, [orgUnitID, program]);

    return {
        searchString,
        handleSearch,
        categories,
        tableColumns,
        loading,
        records,
        handleChange,
        navigate
    }
}