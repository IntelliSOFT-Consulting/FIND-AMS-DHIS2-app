import {CardItem} from "../../../shared/components/cards/CardItem";
import {useSelector} from "react-redux";
import {Form, Input, Radio, Select, Spin, Upload} from "antd";
import React, {useEffect, useState} from "react";
import styles from "../styles/NewFile.module.css"
import {useDataEngine} from "@dhis2/app-runtime";
import {useNavigate} from "react-router-dom";


const query = {
    dataStore: {
        resource: "dataStore/KnowledgeHub/files"
    }
}


export const NewFile = () => {


    const {stages, program} = useSelector(state => state.knowledgeHub)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const [form] = Form.useForm()


    const engine = useDataEngine()

    const navigate = useNavigate()

    const [formSection, setFileSection] = useState({})
    const [documentFile, setDocumentFile] = useState({})
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (stages)
            setFileSection(stages[0]?.sections[0])
    }, [stages]);

    const fetchAllDocuments = async () => {
        const response = await engine.query(query)
        return response?.dataStore
    }

    const onFinish = async (values) => {
        console.log("hit", values)
        const existingDocuments = await fetchAllDocuments()
        console.log("existing", existingDocuments)

        // await engine.mutate({
        //     resource: query.dataStore.resource,
        //     data
        // })

    }


    const fileUploadProps = {
        name: "file",
        onChange: async (file) => setDocumentFile(file?.file?.originFileObj)
    }

    const permissions = [
        {
            label: "Public Document",
            value: "public"
        },
        {
            label: "AMS Committee Document",
            value: "ams"
        },

    ]

    return (
        <Form onFinish={onFinish} form={form} layout="vertical" style={{position: "relative"}}>
            <CardItem title="AMS KNOWLEDGE HUB">

                <div className={styles.formLayout}>
                    <Form.Item label="Document name">
                        <Input name="document_name"/>
                    </Form.Item>

                    <Form.Item label="Document permissions">
                        <Radio.Group options={permissions} name="document_permissions"/>
                    </Form.Item>

                    <Form.Item label="Category Selection">
                        <Select options={permissions} name="category"/>
                    </Form.Item>


                    <Form.Item label="Description">
                        <Input.TextArea rows={5} name="document_description"/>
                    </Form.Item>


                    <Form.Item label="Document" style={{gridColumn: "1/3", height: "250px"}}>
                        <Upload.Dragger rows={5} name="file"/>
                    </Form.Item>
                </div>


                <div className={styles.actionContainer}>
                    {loading ? (
                        <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
                    ) : (
                        <>
                            <button type="button"
                                    onClick={() => navigate(-1)}

                                    className={styles.backButton}>BACK
                            </button>
                            <button
                                type="submit" className={styles.successButton}>SUBMIT
                            </button>
                        </>
                    )}
                </div>
            </CardItem>
        </Form>
    )
}