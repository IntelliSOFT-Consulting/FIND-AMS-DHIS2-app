import {Button, DatePicker, Input, Space, Table} from "antd";
import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {useNavigate} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useEffect, useState} from "react"
import {useDataElements} from "../../../shared/hooks/useGetDataElement";
import {useSelector} from "react-redux";

const useStyles = createUseStyles({
    searchContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "end",
        padding: "1rem 0rem",
        gap: "2rem",
        "@media (min-width: 1024px)": {
            flexDirection: "row",
            gap: "10rem",
        },
        marginBottom: "2rem"
    },
    addLink: {
        textDecoration: "underline",
        color: "#1677FF",
        fontStyle: "italic",
        cursor: "pointer",
        fontSize: "14px",
        padding: ".5rem .5rem"
    },
    inputWrapper: {
        position: "relative",
        width: "85%",
        "@media (min-width: 1024px)": {
            width: "80%"
        }
    },
    inputs: {
        borderBottomRightRadius: "0px !important",
        borderTopRightRadius: "0px !important",
        width: "90%",
        borderRight: "0px"
    },
    inputButton: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        height: "100%",
        width: "4rem",
        borderLeft: "0px",
        borderTopLeftRadius: "0px",
        borderBottomLeftRadius: "0px",
        backgroundColor: "#EDF7FF",
        color: "#1677FF",
        textTransform: "uppercase",
        fontWeight: "600",
        fontSize: "10px",
        "@media (min-width: 768px)": {
            width: "6rem",
            fontSize: "14px"
        }
    },
    primaryBtn: {
        padding: ".2rem 2rem",
        borderRadius: "6px",
        color: "#1d5288",
        fontWeight: "600",
        border: "0",
        cursor: "pointer",
        fontSize: "8px",
        "@media(min-width: 768px)": {
            alignSelf: "center",
            padding: "0.7rem 3.5rem",
            "fontSize": "14px",
            fontWeight: 600,
        }
    }

})

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
            order: "occurredAt:desc",
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
    const styles = useStyles()
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
    const styles = useStyles()
    const navigate = useNavigate()

    const {program} = useSelector(state=>state.forms)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    //state hooks
    const [records, setRecords] = useState([])
    const [date, setDate] = useState(null)
    const [dateString, setDateString] = useState(null)
    const [ip, setIp] = useState(null)
    const [instances, setInstances] = useState(null)


    const {getDataElementByID, getDataElementByName} = useDataElements()

    /**
     * Query hook
     */
    const {loading, data, refetch} = useDataQuery(query)


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


    return (
        <CardItem title={Header()}>
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
        </CardItem>
    )
}