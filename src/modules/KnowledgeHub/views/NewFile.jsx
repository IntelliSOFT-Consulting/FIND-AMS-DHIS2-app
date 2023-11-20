import {CardItem} from "../../../shared/components/cards/CardItem";
import {useSelector} from "react-redux";
import {Form, Input, Radio, Select, Spin, Upload} from "antd";
import React, {useState} from "react";
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

    const [loading, setLoading] = useState(false)


    const fetchAllDocuments = async () => {
        const response = await engine.query(query)
        return response?.dataStore
    }

    const onFinish = async (values) => {
        console.log("hit", values)
        const existingDocuments = await fetchAllDocuments()

        const reader = new FileReader()

        reader.onload = (evt) => {
            return evt.target.result
        }


        const payload = {
            ...existingDocuments,

        }

        payload[values.document_name] = {
            ...values,
            file: reader.readAsDataURL(values.file.fileList[0].originFileObj)
        }

        console.log("payload", payload)

        await engine.mutate({
            type: "update",
            resource: query.dataStore.resource,
            data: payload
        })

    }


    const fileUploadProps = {
        name: "file",
        onChange: async (options) => {
            const reader = new FileReader()

            reader.onload = (evt) => {
                return evt.target.result
            }

            console.log("options", options.file.originFileObj)
        }
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
                    <Form.Item name="document_name" label="Document name">
                        <Input name="document_name"/>
                    </Form.Item>

                    <Form.Item name="document_permissions" label="Document permissions">
                        <Radio.Group options={permissions} name="document_permissions"/>
                    </Form.Item>

                    <Form.Item name="category" label="Category Selection">
                        <Select options={permissions} name="category"/>
                    </Form.Item>


                    <Form.Item name="document_description" label="Description">
                        <Input.TextArea rows={5} name="document_description"/>
                    </Form.Item>


                    <Form.Item name="file" label="Document">
                        <Upload.Dragger maxCount={1} onChange={fileUploadProps.onChange} rows={5} name="file"/>
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