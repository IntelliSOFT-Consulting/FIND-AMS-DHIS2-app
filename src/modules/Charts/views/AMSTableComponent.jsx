import {Button, DatePicker, Input, Space, Table} from "antd";
import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {useNavigate} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";

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
            order: "occurredAt:desc"
        }
    }
}


export const AMSTableComponent = () => {
    const styles = useStyles()

    const navigate = useNavigate()


    const {loading, error, data} = useDataQuery(query)


    const columns = [
        {
            title: 'IP/OP NO.',
            dataIndex: 'address',
            key: 'name',
            render: item => Object.values(item)[3]
        },
        {
            title: 'WARD',
            dataIndex: 'username',
            key: 'name',
        },
        {
            title: 'DATE ADDED',
            dataIndex: 'address',
            key: 'name',
            render: () => new Date().toLocaleDateString()
        },
        {
            title: "Actions",
            dataIndex: "Actions",
            key: "name",
            render: (text, record) => (
                <Space size="middle">
                    <div
                        onClick={() => navigate("/charts/submitted-form")}
                        className={styles.addLink}>View
                    </div>
                </Space>
            )
        }
    ];

    const header = () => (
        <div className="card-header">
            <p className="card-header-text">AMS CHART REVIEW</p>
            <button
                onClick={() => navigate("/charts/members-present-form")}
                className="primary-btn">ADD NEW
            </button>
        </div>
    )


    return (
        <CardItem title={header()}>
            <div className={styles.searchContainer}>
                <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%"}}>
                    <label style={{cursor: "pointer"}} htmlFor="date">Filter by Date</label>
                    <div className={styles.inputWrapper}>
                        <DatePicker
                            className={styles.inputs}
                            size="large"
                            id="date"
                            placeholder="Select date"
                            label="Filter by Date"
                        />
                        <Button className={styles.inputButton}>Go</Button>
                    </div>

                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%"}}>
                    <label style={{cursor: "pointer"}} htmlFor="ip/op">Search Specific Records</label>
                    <div className={styles.inputWrapper}>
                        <Input
                            className={styles.inputs}
                            size="large"
                            id="ip/op"
                            placeholder="Search using IP/OP NO."
                            label="Filter by Date"
                        />
                        <Button className={styles.inputButton}>SEARCH</Button>
                    </div>

                </div>
            </div>
            <Table
                rowKey={record => record?.name}
                loading={loading}
                pagination={data?.events.instances.length > 10 ? {pageSize: 10} : false}
                dataSource={data?.events?.instances }
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