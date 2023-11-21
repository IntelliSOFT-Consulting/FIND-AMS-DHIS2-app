import {Button, Input, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {categoryItems} from "../data/data";
import moduleStyles from "../styles/ListGuidelines.module.css"
import styles from "../styles/ListGuidelines.module.css"
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {getDataElementObjectByID} from "../../../shared/helpers/formatData";

const query = {
    events: {
        resource: "tracker/events",
        params: ({filter = "", program, orgUnit}) => ({
            page: 1,
            pageSize: 15,
            program,
            orgUnit,
            fields: "dataValues,occurredAt,event,status,orgUnit,program,programType,updatedAt,createdAt,assignedUser",
            order: "occurredAt:desc",
            filter
        })
    }
}


export const ListGuidelines = () => {

    const [records, setRecords] = useState([])
    const [searchString, setSearchString] = useState("")
    const [documentNameElementID, setDocumentNameElementID] = useState("")
    const navigate = useNavigate()


    /**
     * Query hook
     */
    const {loading, data, refetch} = useDataQuery(query)

    const {program, stages} = useSelector(state => state.knowledgeHub)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)


    useEffect(() => {
        if (stages) {
            const elementObject = stages[0]?.sections[0]?.dataElements.find(element => element.name.toLowerCase().includes("name"))
            console.log("elementObject", elementObject)
            setDocumentNameElementID(elementObject.id)
        }
    }, [stages]);

    useEffect(() => {
        refetch({
            orgUnit: orgUnitID,
            program: program
        })
    }, [orgUnitID, program]);


    const formatTableData = () => {
        if (stages && data) {
            data?.events?.instances.forEach(instance => {
                let item = {
                    createdAt: instance.createdAt
                }
                instance.dataValues.forEach(dataValue => {
                    const dataElement = getDataElementObjectByID({
                        elementId: dataValue.dataElement,
                        dataElements: stages[0]?.sections[0]?.dataElements
                    })
                    item[dataElement?.name] = dataValue.value
                })
                setRecords(prev => [...prev, item])

            })

        }
    }


    useEffect(() => {
        if (stages?.length > 0 && data?.events)
            formatTableData()
        return () => {
            setRecords([])
        }
    }, [data]);

    const columns = [
        {
            title: 'DOCUMENT NAME',
            dataIndex: 'Document Name',
            key: 'Document Name',
        },
        {
            title: 'Permissions',
            dataIndex: 'Document Permissions',
            key: 'Document Permissions',
        },
        {
            title: 'DATE ADDED',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: () => new Date().toLocaleDateString()
        },
        {
            title: "Actions",
            dataIndex: "Actions",
            key: "Actions",
            render: () => (
                <Space size="middle">
                    <div
                        onClick={() => navigate("/knowledge-hub/file/1")}
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

    const handleSearch = async () => {
        if (searchString)
            await refetch({
                filter: `${documentNameElementID}:ILIKE:${searchString}`
            })
        else await refetch({
            filter: ""
        })
    }

    const handleChange = async (evt) => {
        setSearchString(evt.target.value)
        if (evt.target.value === "")
            await refetch({
                filter: ""
            })
    }


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
                    <button
                        onClick={() => navigate("/knowledge-hub/new-file")}
                        className="outline-btn">UPLOAD NEW FILE
                    </button>
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
                    rowKey={record => record?.createdAt}
                    loading={loading}
                    pagination={data?.length > 10 ? {pageSize: 10} : false}
                    dataSource={records}
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