import {Button, Input, notification, Space, Table} from "antd";
import {useEffect, useState} from "react";
import styles from "../styles/ListGuidelines.module.css"
import {useDataEngine, useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {getDataElementObjectByID} from "../../../shared/helpers/formatData";
import {useNavigate} from "react-router-dom";
import {SideNav} from "../components/SideNav";
import {downloadPDF} from "../helpers";

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
    const [documentCategoryElementID, setDocumentCategoryElementID] = useState("")
    const [documentFileElementID, setDocumentFileElementID] = useState("")
    const [documentCategories, setDocumentCategories] = useState([])
    const navigate = useNavigate()


    /**
     * Query hook
     */
    const {loading, data, refetch} = useDataQuery(query)

    const {program, stages} = useSelector(state => state.knowledgeHub)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)


    /**
     * Load the state hooks that store the category data element ID and the document data element ID for filtering purposes
     * Also loads the document categories array for use when mapping through side nav items
     */
    useEffect(() => {
        if (stages) {
            const documentNameObject = stages[0]?.sections[0]?.dataElements.find(element => element.name.toLowerCase().includes("name"))
            setDocumentNameElementID(documentNameObject.id)

            const documentFileObject = stages[0]?.sections[0]?.dataElements.find(element => element.name.toLowerCase().includes("file"))
            setDocumentFileElementID(documentFileObject.id)

            const documentCategoryObject = stages[0]?.sections[0]?.dataElements.find(element => element.name.toLowerCase().includes("category"))
            setDocumentCategoryElementID(documentCategoryObject.id)
            setDocumentCategories(documentCategoryObject.optionSet.options)
        }
    }, [stages]);

    /**
     * Get the instances once the program and the organization unit and the program are present in the redux store
     */
    useEffect(() => {
        refetch({
            orgUnit: orgUnitID,
            program: program
        })
    }, [orgUnitID, program]);


    /**
     * Formats table data by creating objects with the necessary fields
     */
    const formatTableData = () => {
        if (stages && data) {
            data?.events?.instances.forEach(instance => {
                let item = {
                    createdAt: instance.createdAt,
                    eventID: instance.event
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


    /**
     * Populates the table state hook once the data is fetched
     * Clears the table once the component is unmounted to ensure integrity
     */
    useEffect(() => {
        if (stages?.length > 0 && data?.events)
            formatTableData()
        return () => {
            setRecords([])
        }
    }, [data]);

    /**
     * Datatable Columns
     * @type {[{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, key: string},{dataIndex: string, title: string, render: (function(): string), key: string},{dataIndex: string, title: string, render: (function(): *), key: string}]}
     */
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
            render: (text, record) => (
                <Space size="middle">
                    <div
                        onClick={() => navigate(`/knowledge-hub/file/${record.eventID}`)}
                        className={styles.actionLink}>
                        View
                    </div>
                    <div
                        className={styles.actionLink}>
                        Archive
                    </div>
                    <div
                        onClick={() => handleDownload({fileName: record['Document Name'], eventUid: record.eventID})}
                        className={styles.actionLink}>
                        Download
                    </div>
                    <div
                        style={{color: "#ff0000"}}
                        className={styles.actionLink}>
                        Delete
                    </div>
                </Space>
            )
        }
    ];

    /**
     * Search button click handler
     * Filters all documents by name
     * @returns {Promise<void>}
     */
    const handleSearch = async () => {
        if (searchString)
            await refetch({
                filter: `${documentNameElementID}:ILIKE:${searchString}`
            })
        else await refetch({
            filter: ""
        })
    }

    /**
     * Change handler for search string input
     * Fetched all documents if you delete all characters
     * @param evt
     * @returns {Promise<void>}
     */
    const handleChange = async (evt) => {
        setSearchString(evt.target.value)
        if (evt.target.value === "")
            await refetch({
                filter: ""
            })
    }


    /**
     * Handler for clicking on sidenav buttons
     * It filters data according to the category
     * @param categoryCode
     * @returns {Promise<void>}
     */
    const filterByCategory = async (categoryCode) => {
        setSearchString("")
        if (categoryCode === "")
            await refetch({
                filter: ""
            })
        else
            await refetch({
                filter: `${documentCategoryElementID}:ILIKE:${categoryCode}`
            })
    }

    const engine = useDataEngine()

    /**
     * Event handler that downloads a pdf doc
     * First fetch the Blob from the DHIS2 instance
     * Then send that blob to the helper function that creates an anchor tag dynamically and..
     * clicks on it to download the file
     * @param fileName
     * @param eventUid
     * @returns {Promise<void>}
     */
    const handleDownload = async ({fileName, eventUid}) => {
        try {

            const response = await engine.query({
                events: {
                    resource: "/events/files",
                    params: {
                        dataElementUid: documentFileElementID,
                        eventUid
                    }
                }
            })
            await downloadPDF({fileBlob: response?.events, documentName: fileName})

        } catch (e) {
            notification.error({
                message: "Something went wrong"
            })
        }
    }


    return (
        <div className={styles.parentContainer}>
            <SideNav callbackHandler={filterByCategory} options={documentCategories}/>

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
                    rowKey={record => record?.eventID}
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