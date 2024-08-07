import {Button, Input, Table} from "antd";
import styles from "../styles/ListGuidelines.module.css"
import {SideNav} from "../../../shared/components/Nav/SideNav";
import {useViewDocuments} from "../hooks/useViewDocuments";

const query = {
    events: {
        resource: "tracker/events",
        params: ({filter = "", program, orgUnit}) => ({
            program,
            orgUnit,
            fields: "dataValues,occurredAt,event,status,orgUnit,program,programType,updatedAt,createdAt,assignedUser",
            order: "occurredAt:desc",
            filter
        })
    }
}


export const ViewDocuments = () => {

    const {
        records,
        searchString,
        documentCategories,
        navigate,
        loading,
        handleChange,
        handleSearch,
        columns,
        data
    } = useViewDocuments()

    return (
        <div className={styles.parentContainer}>
            <SideNav title="Categories" options={documentCategories}/>

            <div className={styles.tableContainer}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #D3D3D3"
                }}>
                    <p style={{fontSize: "14px", padding: "4px"}}>AMS KNOWLEDGE HUB</p>
                    <Button
                        type="primary"
                        onClick={() => navigate("/knowledge-hub/new-file")}
                        >UPLOAD NEW RESOURCE
                    </Button>
                </div>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem"}}>
                    <Input
                        value={searchString}
                        onChange={handleChange}
                        className={styles.inputs}
                        size="large"
                        id="ip/op"
                        placeholder="Search using document name"
                        label="Filter by Date"
                    />
                    <button
                        onClick={handleSearch}
                        className="outline-btn">SEARCH
                    </button>
                </div>
                <Table
                    style={{width: '100%', border: "1px solid #d3d3d3", borderRadius: "6px"}}
                    rowKey={record => record?.eventID}
                    loading={loading}
                    pagination={data?.length > 10 ? {pageSize: 10} : false}
                    dataSource={records}
                    columns={columns}
                    bordered
                    locale={{
                        emptyText: (
                            <div>
                                <p>No Results. Add new document?</p>
                                <Button
                                    onClick={() => navigate("/knowledge-hub/new-file")}
                                    type="primary">
                                    New
                                </Button>
                            </div>
                        ),
                    }}
                />
            </div>
        </div>
    )
}