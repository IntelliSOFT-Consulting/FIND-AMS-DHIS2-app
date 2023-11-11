import {Button, DatePicker, Input, Space, Table} from "antd";
import {CardItem} from "../../../shared/components/CardItem";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
    header: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: "400",
    },
    newButton: {
        padding: "0.7rem 3.5rem",
        borderRadius: "6px",
        color: "#1d5288",
        fontWeight: "600",
        border: "0",
        cursor: "pointer",
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
        "@media (min-width: 768px)": {

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
            letterSpacing: ".1rem",
            fontSize: "14px"
        }
    }

})

export const AMSTableComponent = () => {
    const styles = useStyles()

    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: "Actions",
            dataIndex: "Actions",
            key: "Actions",
            render: (text, record) => (
                <Space size="middle">
                    <div className={styles.addLink}>Add</div>
                </Space>
            )
        }
    ];

    const header = () => (
        <div className={styles.header}>
            <p>AMS CHART REVIEW</p>
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
                            enterButton="Go"
                        />
                        <Button className={styles.inputButton}>Go</Button>
                    </div>

                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%"}}>
                    <label style={{cursor: "pointer"}} htmlFor="date">Search Specific Records</label>
                    <div className={styles.inputWrapper}>
                        <Input
                            className={styles.inputs}
                            size="large"
                            id="date"
                            placeholder="Search using IP/OP NO."
                            label="Filter by Date"
                            enterButton="Search"
                        />
                        <Button className={styles.inputButton}>SEARCH</Button>
                    </div>

                </div>
            </div>
            <Table
                pagination={dataSource?.length > 10 ? {pageSize: 10} : false}
                dataSource={dataSource}
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