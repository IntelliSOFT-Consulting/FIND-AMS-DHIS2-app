import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {Button, DatePicker, Input, Select, Space, Table} from "antd";
import {useNavigate} from "react-router-dom";


const useStyles = createUseStyles({
    formContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "2rem",
        alignContent: "center",
        "@media (min-width: 768px)": {
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem 4rem"
        }
    },
    placeholderDiv: {
        display: "hidden",
        "@media (min-width: 768px)": {
            display: "flex"
        }
    },
    removeLink: {
        textDecoration: "underline",
        color: "#ff0000",
        fontStyle: "italic",
        cursor: "pointer"
    },
})


export const MembersForm = () => {
    const styles = useStyles()
    const navigate = useNavigate()

    const Header = () => (
        <div className="card-header">
            <p className="card-header-text">MEMBERS PRESENT</p>
            <button
                onClick={() => navigate("/charts/new-form")}
                className="primary-btn">START
            </button>
        </div>
    )

    const columns = [
        {
            title: 'Full Names',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: "Action",
            dataIndex: "Actions",
            key: "name",
            render: (text, record) => (
                <Space size="middle">
                    <div className={styles.removeLink}>Remove</div>
                </Space>
            )
        }

    ]
    const dummyData = [
        {fullName: "John Doe"},
        {fullName: "Jane Doe"},
        {fullName: "Mike Doe"},
        {fullName: "Beth Doe"},
    ]

    return (
        <CardItem title={Header()}>
            <form className={styles.formContainer}>
                <div className="form-control">
                    <label htmlFor="fullName">Full Names<span style={{color: "red"}}>&nbsp;*</span></label>
                    <Input size="large" id="fullName" />
                </div>
                <div className="form-control">
                    <label htmlFor="date">Date<span style={{color: "red"}}>&nbsp;*</span></label>
                    <DatePicker
                        required
                        className={styles.inputs}
                        size="large"
                        id="date"
                        placeholder="Date"
                        label="Filter by Date"
                    />
                </div>
                <div className="form-control">
                    <label htmlFor="designation">Designation<span style={{color: "red"}}>&nbsp;*</span></label>
                    <Select
                        id="designation"
                        defaultValue="Designation"
                        required
                        size="large"
                    />
                </div>
                <div className={styles.placeholderDiv}/>
                <button
                    style={{
                        width: "fit-content",
                        fontWeight: "700",
                        fontSize: "16px",
                        backgroundColor: "#E3EEF7",
                        marginLeft: "auto",
                        padding: ".8rem 4rem"
                    }}
                    className="primary-btn">ADD
                </button>
                <div className={styles.placeholderDiv}/>
                <Table
                    pagination={dummyData?.length > 10 ? {pageSize: 10} : false}
                    bordered
                    rowKey={record =>record?.fullName}
                    columns={columns}
                    dataSource={dummyData}
                    locale={{
                        emptyText: (
                            <div>
                                <p>No Results.</p>
                            </div>
                        ),
                    }}
                />


            </form>
        </CardItem>
    )
}