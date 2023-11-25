import {Button, DatePicker, Input, Space, Table} from "antd";
import {CardItem} from "../../../shared/components/cards/CardItem";
import {useNavigate} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useEffect, useState} from "react"
import {useDataElements} from "../../../shared/hooks/useGetDataElement";
import {useSelector} from "react-redux";
import {WardsNav} from "../Components/WardsNav";
import styles from "../styles/ViewCharts.module.css"

const query = {
    events: {
        resource: "tracker/events",
        params: ({filter = "", date = "", program, orgUnit}) => ({
            page: 1,
            pageSize: 15,
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
/**
 * Card header component
 * @returns {JSX.Element}
 */
const Header = () => {
    const navigate = useNavigate()
    return (
        <div className="card-header">
            <p className="card-header-text">AMS CHART REVIEW</p>
            <button
                onClick={() => navigate("/charts/members-present-form")}
                className={styles.primaryBtn}>ADD NEW
            </button>
        </div>
    )
}


export const ViewCharts = () => {
    const navigate = useNavigate()

    const {program, stages} = useSelector(state => state.forms)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    //state hooks
    const [records, setRecords] = useState([])
    const [date, setDate] = useState(null)
    const [dateString, setDateString] = useState(null)
    const [ip, setIp] = useState(null)
    const [instances, setInstances] = useState(null)
    const [wardElementID, setWardElementId] = useState("")
    const [wards, setWards] = useState([])


    const {getDataElementByID, getDataElementByName} = useDataElements()

    /**
     * Query hook
     */
    const {loading, data, refetch} = useDataQuery(query)


    useEffect(() => {
        const wardElement = getDataElementByName("Ward (specialty)")
        setWards(wardElement?.optionSet?.options)
        setWardElementId(wardElement?.id)
    }, [stages]);


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
                        onClick={() => navigate(`/charts/event/${record.eventUid}`)}
                        className={styles.addLink}>View
                    </div>
                </Space>
            )
        }

    ]

    /**
     * Load state on query execution
     */
    useEffect(() => {
        setInstances(data?.events?.instances)
        setRecords(data?.events.instances)
    }, [data]);


    /**
     * Filter the records by adding filter parameter with the data element id of the date
     * @returns {Promise<void>}
     */
    const filterByIp = async () => {
        if (ip)
            await refetch({
                filter: `${getDataElementByName("ip/op").id}:ILIKE:${ip}`,
            })
    }

    /**
     * Filter the records by adding filter parameter with the data element id of the date
     * @returns {Promise<void>}
     */
    const filterByDate = async () => {
        if (dateString)
            await refetch({
                date: dateString,
            })
    }

    const clearFilters = async () => {
        await refetch({filter: "", date: ""})
        setDateString(null)
        setDate(null)
        setIp(null)
    }

    const filterByWards = async (wardCode) => {
        setIp("")
        setDate("")
        setDateString("")
        if (wardCode === "")
            await refetch({
                filter: ""
            })
        else
            await refetch({
                filter: `${wardElementID}:ILIKE:${wardCode}`
            })
    }


    return (
        <CardItem title={Header()}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem"}}>
                <WardsNav
                    callbackHandler={filterByWards}
                    options={wards}/>
                <div className="">
                    <div className={styles.searchContainer}>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%"}}>
                            <label style={{cursor: "pointer"}} htmlFor="date">Filter by Date</label>
                            <div className={styles.inputWrapper}>
                                <DatePicker
                                    onChange={(date, dateString) => {
                                        setDate(date)
                                        setDateString(dateString)
                                    }}
                                    value={date}
                                    className={styles.inputs}
                                    size="large"
                                    id="date"
                                    placeholder="Select date"
                                    label="Filter by Date"
                                />
                                <Button
                                    onClick={filterByDate}
                                    className={styles.inputButton}>Go</Button>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%"}}>
                            <label style={{cursor: "pointer"}} htmlFor="ip/op">Search Specific Records</label>
                            <div className={styles.inputWrapper}>
                                <Input
                                    value={ip}
                                    onChange={evt => setIp(evt.target.value)}
                                    className={styles.inputs}
                                    size="large"
                                    id="ip/op"
                                    placeholder="Search using IP/OP NO."
                                    label="Filter by Date"
                                />
                                <Button
                                    onClick={filterByIp}
                                    className={styles.inputButton}>SEARCH</Button>
                            </div>
                        </div>
                        <Button
                            onClick={clearFilters}
                            danger={true}>Clear filters</Button>
                    </div>
                    <Table
                        rowKey={record => record?.eventUid}
                        loading={loading}
                        pagination={records?.length > 10 ? {pageSize: 10} : false}
                        dataSource={instances?.flatMap(instance => {
                            const object = {
                                createdAt: instance.createdAt,
                                eventUid: instance.event
                            }

                            instance.dataValues.forEach(dataValue => {
                                const dataElement = getDataElementByID(dataValue?.dataElement)
                                object[dataElement?.displayName] = dataValue.value;
                            })
                            return object

                        })}
                        columns={chartTableColumns}
                        bordered
                        size="small"
                        locale={{
                            emptyText: (
                                <div>
                                    <p>No Results. Add new chart</p>
                                    <Button
                                        onClick={() => navigate("/charts/members-present-form")}
                                        type="primary">
                                        New
                                    </Button>
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>


        </CardItem>
    )
}