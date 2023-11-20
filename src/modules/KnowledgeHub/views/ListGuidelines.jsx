import {createUseStyles} from "react-jss";
import {Button, Input, Space, Table} from "antd";
import {useAxios} from "../../../shared/hooks/useAxios";
import {useEffect} from "react";
import {NavLink} from "react-router-dom";
import {categoryItems} from "../data/data";
import moduleStyles from "../styles/ListGuidelines.module.css"

const useStyles = createUseStyles({
    parentContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        padding: "1rem",
        gap: " 2rem",
        "@media (min-width: 1024px)": {
            gridTemplateColumns: "1fr 4fr"
        }
    },
    categoryContainer: {
        display: "flex",
        backgroundColor: "white",
        flexDirection: "row",
        gap: "12px",
        boxShadow: "4px 4px 4px #D3D3D3",
        border: "1px solid #d3d3d3",
        color: "#2C6693",
        fontSize: "12px",
        padding: "1rem .8rem",
        borderRadius: "6px",
        "@media (min-width: 1024px)": {
            flexDirection: "column"
        }
    },
    tableContainer: {
        display: 'flex',
        flexDirection: "column",
        padding: "1rem 1rem",
        gap: "2rem",
        borderRadius: "6px",
        boxShadow: "4px 4px 4px #D3D3D3",
        border: "1px solid #d3d3d3",
    },
    actionLink: {
        textDecoration: "underline",
        fontStyle: "italic",
        cursor: "pointer",
        fontSize: "12px",
        color: "#1677FF"
    }
})

export const ListGuidelines = () => {
    const styles = useStyles()

    const {loading, makeRequest, error, data} = useAxios()

    useEffect(() => {
        makeRequest({
            url: "/users"
        })
    }, []);


    const columns = [
        {
            title: 'DOCUMENT NAME',
            dataIndex: 'address',
            key: 'name',
            render: item => Object.values(item)[3]
        },
        {
            title: 'ADDED BY',
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
                        className={styles.actionLink}>
                        View
                    </div>
                    <div
                        onClick={() => navigate("/charts/submitted-form")}
                        className={styles.actionLink}>
                        Archive
                    </div>
                    <div
                        onClick={() => navigate("/charts/submitted-form")}
                        className={styles.actionLink}>
                        Download
                    </div>
                    <div
                        style={{color: "#ff0000"}}
                        onClick={() => navigate("/charts/submitted-form")}
                        className={styles.actionLink}>
                        Delete
                    </div>
                </Space>
            )
        }
    ];

    return (
        <div className={styles.parentContainer}>
            <div className={styles.categoryContainer}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #D3D3D3"
                }}>
                    <p style={{fontSize: "14px", padding: "4px"}}>Categories.</p>
                </div>
                {
                    categoryItems.map((category, index) => (
                        <NavLink
                            to={category.path}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: index === 0 ? 'space-between' : 'start',
                                gap: "1rem",
                                border: "1px solid",
                                borderRadius: '4px',
                                padding: ".1rem 1rem",
                                cursor: "pointer"
                            }}
                            key={index} className={moduleStyles.navItem}>
                            <category.icon style={{order: index === 0 ? 2 : 1, width: "2rem", height: "2rem"}}/>
                            <p style={{order: index === 0 ? 1 : 2}}>{category.name}</p>
                        </NavLink>
                    ))
                }
            </div>
            <div className={styles.tableContainer}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #D3D3D3"
                }}>
                    <p style={{fontSize: "14px", padding: "4px"}}>Guidelines</p>
                    <button className="outline-btn">UPLOAD NEW FILE</button>
                </div>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem"}}>
                    <Input
                        className={styles.inputs}
                        size="large"
                        id="ip/op"
                        placeholder="Search using document name"
                        label="Filter by Date"
                    />
                    <button className="outline-btn">SEARCH</button>
                </div>
                <Table
                    style={{width: '100%', border: "1px solid #d3d3d3", borderRadius: "6px"}}
                    rowKey={record => record?.name}
                    loading={loading}
                    pagination={data?.length > 10 ? {pageSize: 10} : false}
                    dataSource={data}
                    columns={columns}
                    bordered
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
            </div>
        </div>
    )
}