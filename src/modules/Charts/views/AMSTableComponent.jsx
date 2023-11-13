import {Button, DatePicker, Input, Space, Table} from "antd";
import {CardItem} from "../../../shared/components/CardItem";
import {createUseStyles} from "react-jss";
import {useAxios} from "../../../shared/hooks/useAxios";
import {useEffect} from "react";

const useStyles = createUseStyles({
    header: {
        display: "flex",
        width: "100%",
        fontWeight: "400",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerText: {
        fontSize: '10px',
        "@media (min-width: 768px)": {
            fontSize: "14px"
        }
    },
    newButton: {
        padding: ".2rem 2rem",
        borderRadius: "6px",
        color: "#1d5288",
        fontWeight: "600",
        border: "0",
        cursor: "pointer",
        fontSize: "8px",
        "@media (min-width: 768px)": {
            alignSelf: 'center',
            padding: "0.7rem 3.5rem",
            fontSize: "12px",

        }
    },
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
        cursor: "pointer"
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

export const AMSTableComponent = () => {
    const styles = useStyles()

    const {loading, makeRequest, error, data} = useAxios()

    useEffect(() => {
        makeRequest({
            url: "/users"
        })
    }, []);


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
                    <div className={styles.addLink}>Add</div>
                </Space>
            )
        }
    ];

    const header = () => (
        <div className={styles.header}>
            <p className={styles.headerText}>AMS CHART REVIEW</p>
            <button className={styles.newButton}>ADD NEW</button>
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
                pagination={data?.length > 10 ? {pageSize: 10} : false}
                dataSource={data}
                columns={columns}
                bordered
                size="small"
                locale={{
                    emptyText: (
                        <div>
                            <p>No Results. Add new chart</p>
                            <Button type="primary">
                                View
                            </Button>
                        </div>
                    ),
                }}
            />
        </CardItem>
    )
}