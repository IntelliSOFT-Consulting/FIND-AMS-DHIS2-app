import {Button, DatePicker, Input, Space, Table} from "antd";
import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {useNavigate} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useEffect, useState} from "react"

const useStyles = createUseStyles({
    searchContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
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
        fontSize: "10px"
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
    }

})

const query = {
    events: {
        resource: "tracker/events",
        params: {
            page: 1,
            pageSize: 15,
            program: "KqmTbzBTDVj",
            orgUnit: "p3FIxnPMytB",
            fields: "dataValues,occurredAt,event,status,orgUnit,program,programType,updatedAt,createdAt,assignedUser",
            ouMode: "SELECTED",
            order: "occurredAt:desc",
        }
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
                className="primary-btn">ADD NEW
            </button>
        </div>
    )
}


export const AMSTableComponent = () => {
    const styles = useStyles()
    const navigate = useNavigate()

    //state hooks
    const [records, setRecords] = useState([])
    const [date, setDate] = useState(null)
    const [dateString, setDateString] = useState(null)
    const [ip, setIp] = useState(null)


    /**
     * Query hook
     */
    const {loading, data, refetch} = useDataQuery(query)


    /**
     * Table columns
     * @type {[{dataIndex: string, title: string, render: (function(*): unknown), key: string},{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, render: (function(): string), key: string},{dataIndex: string, title: string, render: (function(*, *): *), key: string}]}
     */
    const columns = [
        {
            title: 'IP/OP NO.',
            dataIndex: 'dataValues',
            key: 'event',
            render: (text, record) => (record?.dataValues.find(dataValue => dataValue.dataElement === "qm3sLorGhAm"))?.value
        },
        {
            title: 'WARD',
            dataIndex: 'dataValues',
            key: 'event',
            render: (text, record) => (record?.dataValues.find(dataValue => dataValue.dataElement === "u4UlC8FpDCV"))?.value
        },
        {
            title: 'DATE ADDED',
            dataIndex: 'createdAt',
            key: 'event',
            render: (text, record) => new Date(record?.createdAt).toLocaleDateString()
        },
        {
            title: "Actions",
            dataIndex: "Actions",
            key: "event",
            render: (text, record) => (
                <Space size="middle">
                    <div
                        onClick={() => navigate(`/charts/submitted-form/${record.event}`)}
                        className={styles.addLink}>View
                    </div>
                </Space>
            )
        }
    ];

    /**
     * Load state on query execution
     */
    useEffect(() => {
        setRecords(data?.events.instances)
    }, [data]);


    /**
     * Filter the records by adding filter parameter with the data element id of the date
     * @returns {Promise<void>}
     */
    const filterByIp = async () => {
        setDate(null)
        setDateString(null)
        if (ip)
            await refetch({
                filter: `qm3sLorGhAm:ILIKE:${ip}`
            })
    }

    /**
     * Filter the records by adding filter parameter with the data element id of the date
     * @returns {Promise<void>}
     */
    const filterByDate = async () => {
        setIp(null)
        if (dateString)
            await refetch({
                filter: `xyfKcCPVDgv:ILIKE:${dateString}`
            })
    }


    console.log('records', records)

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
            </div>
            <Table
                rowKey={record => record?.name}
                loading={loading}
                pagination={records?.length > 10 ? {pageSize: 10} : false}
                dataSource={records}
                columns={columns}
                bordered
                size="small"
                locale={{
                    emptyText: (
                        <div>
                            <p>No Results. Add new chart</p>
                            <Button type="primary">
                                New
                            </Button>
                        </div>
                    ),
                }}
            />
        </CardItem>
    )
}