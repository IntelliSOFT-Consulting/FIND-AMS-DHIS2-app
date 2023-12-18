import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDataEngine, useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {useKnowledgeHub} from "../../../shared/hooks/useKnowledgeHub";
import {useDataElements} from "./useDataElements";
import {FolderAddOutlined, FolderOutlined} from "@ant-design/icons";
import {notification, Popconfirm, Space} from "antd";
import styles from "../styles/ListGuidelines.module.css";
import {downloadPDF} from "../helpers";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/20/solid";

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

export const useViewDocuments = () => {

    const [records, setRecords] = useState([])

    const [searchString, setSearchString] = useState("")

    const [documentCategories, setDocumentCategories] = useState([])

    const {dataElements} = useSelector(state => state.knowledgeHub)

    const navigate = useNavigate()

    const engine = useDataEngine()

    const {program, stages} = useSelector(state => state.knowledgeHub)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const {getKnowledgeForm} = useKnowledgeHub()

    const {getDataElementByName, getDataElementByID} = useDataElements()

    const {loading, data, refetch} = useDataQuery(query)

    const filterByCategory = async (categoryCode) => {
        setSearchString("")
        if (categoryCode === "")
            await refetch({
                filter: ""
            })
        else
            await refetch({
                filter: `${getDataElementByName("category")?.id}:ILIKE:${categoryCode}`
            })
    }

    const handleSearch = async () => {
        if (searchString)
            await refetch({
                filter: `${getDataElementByName("name")?.id}:ILIKE:${searchString}`
            })
        else await refetch({
            filter: ""
        })
    }

    const handleChange = async evt => {
        setSearchString(evt.target.value)

        if (evt.target.value === "")
            await refetch({filter: ""})
    }

    const handleDownload = async ({fileName, eventUid}) => {
        try {
            const response = await engine.query({
                events: {
                    resource: "/events/files",
                    params: {
                        dataElementUid: getDataElementByName("file")?.id,
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

    const handleDelete = async ({eventUid}) => {
        try {
            const payload = {
                events: [
                    {
                        event: eventUid,
                    }
                ]
            }

            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false,
                    importStrategy: "DELETE"
                }
            })
            if (response.status === "OK") {
                notification.success({
                    message: "Success"
                })
                await refetch({})
            }

        } catch (e) {
            notification.error({
                message: "Error deleting document"
            })
        }
    }

    const handleDeleteFolder = async ({optionSetID, optionID}) => {
        try {
            const firstResponse = await engine.mutate({
                resource: `optionSets/${optionSetID}/options/${optionID}`,
                type: "delete",
                params: {
                    async: false,
                    importStrategy: "DELETE"
                }
            })

            const secondResponse = await engine.mutate({
                resource: `options/${optionID}`,
                type: "delete",
                params: {
                    async: false,
                    importStrategy: "DELETE"
                }
            })

            if (firstResponse.status === "OK" && secondResponse.status === "OK"){
                notification.success({
                    message: "success",
                })
                window.location.reload()
            }



        } catch (e) {
            notification.error({
                message: "error",
                description: "Couldn't delete folder"
            })
        }
    }

    const formatTableData = () => {
        if (stages && data)
            data?.events?.instances.forEach(instance => {
                let item = {
                    createdAt: instance.createdAt,
                    eventID: instance.event
                }
                instance.dataValues.forEach(dataValue => {
                    const dataElement = getDataElementByID(dataValue.dataElement)
                    item[dataElement?.displayName] = dataValue.value
                })
                setRecords(prev => [...prev, item])
            })
    }

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
            title: 'Created By',
            dataIndex: 'createdBy',
            key: 'createdBy',
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
                        onClick={() => handleDownload({
                            fileName: record['Document Name'],
                            eventUid: record.eventID
                        })}
                        className={styles.actionLink}>
                        Download
                    </div>
                    <Popconfirm
                        description="Are you sure you want to delete this document?"
                        onConfirm={() => handleDelete({eventUid: record.eventID})}
                        okText="Yes"
                        cancelText="No"
                        title="Delete the event">
                        <div
                            style={{color: "#ff0000"}}
                            className={styles.actionLink}>
                            Delete
                        </div>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    /**
     * Refresh the redux store on mount
     * This ensures integrity after updates like adding options
     */
    useEffect(() => {
        getKnowledgeForm()
    }, []);

    useEffect(() => {
        if (dataElements?.length > 0) {

            const documentFolders = getDataElementByName("category")?.optionSet?.options?.map(option => ({
                ...option,
                icon: FolderOutlined,
                handler: () => filterByCategory(option.code),
                action: (
                    <Space
                        size="middle">
                        <PencilSquareIcon
                            onClick={() => navigate(`/knowledge-hub/update-category/${getDataElementByName("category")?.optionSet?.id}/${option.id}`)}
                            width={20}
                            height={20}
                        />
                        <Popconfirm
                            onConfirm={() => handleDeleteFolder({
                                optionSetID: getDataElementByName("category")?.optionSet?.id,
                                optionID: option.id
                            })}
                            title="Are you sure you wnat to delete this folder?">
                            <TrashIcon
                                width={20}
                                height={20}
                                color="#ff0000"
                            />
                        </Popconfirm>

                    </Space>
                )
            }))

            setDocumentCategories([{
                displayName: "Add New",
                code: "",
                icon: FolderAddOutlined,
                handler: () => navigate(`/knowledge-hub/new-category/${getDataElementByName("category")?.optionSet?.id}`)
            },
                ...documentFolders,
                {
                    displayName: "All  Documents",
                    code: "",
                    icon: FolderOutlined,
                    handler: () => filterByCategory("")
                }])

        }

    }, [dataElements, stages]);

    useEffect(() => {
        refetch({
            orgUnit: orgUnitID,
            program: program
        })

    }, [orgUnitID, program]);

    useEffect(() => {
        if (stages?.length > 0 && data?.events)
            formatTableData()

        return () => {
            setRecords([])
        }

    }, [stages, data]);


    return {
        records,
        searchString,
        documentCategories,
        navigate,
        loading,
        filterByCategory,
        handleDownload,
        handleChange,
        handleSearch,
        handleDelete,
        formatTableData,
        columns,
        data
    }


}