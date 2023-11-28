import {CardItem} from "../../../shared/components/Cards/CardItem";
import {useSelector} from "react-redux";
import {Form, notification, Spin} from "antd";
import React, {useEffect, useState} from "react";
import styles from "../styles/NewFile.module.css"
import {useDataEngine} from "@dhis2/app-runtime";
import {useNavigate} from "react-router-dom";
import {FormSection} from "../../../shared/components/Forms/FormSection";
import {findSectionObject} from "../../Charts/helpers";
import {useDataElements} from "../hooks/useDataElements";


export const NewFile = () => {
    const [formSections, setFormSections] = useState({
        createFile: {}
    })
    const [file, setFile] = useState(null)

    const {stages, program} = useSelector(state => state.knowledgeHub)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)
    const user = useSelector(state => state.user)
    const {getDataElementByID, getDataElementByName} = useDataElements()

    const [form] = Form.useForm()


    const engine = useDataEngine()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    /**
     * Get form element id by looking for a data element with valueType "FILE_RESOURCE"
     * @returns {*}
     */
    const getFormElementID = () => {
        if (formSections.createFile?.dataElements) {
            const formElement = formSections?.createFile?.dataElements?.find(element => element?.valueType.includes("FILE"))
            return formElement?.id
        }
    }


    const onFinish = async (values) => {
        if (!file) {
            return notification.error({
                message: "Please upload a file"
            })
        }

        /**
         * Add all data elements except the form field
         * @type {{dataElement: *, value: *}[]}
         */
        let dataValues = Object.keys(values).map(key => ({
            dataElement: key,
            value: values[key]
        }))

        dataValues = dataValues.filter(dataValue => dataValue.value !== undefined)

        /**
         * add the file resource id
         */
        dataValues.push({
            dataElement: getFormElementID(),
            value: file
        })

        dataValues.push({
            dataElement: getDataElementByName("createdBy").id,
            value: `${user.surname} ${user.firstName}`
        })


        const payload = {
            events: [
                {
                    occurredAt: new Date().toJSON().slice(0, 10),
                    notes: [],
                    program,
                    programStage: stages[0].id,
                    orgUnit: orgUnitID,
                    dataValues,
                    completedAt: new Date().toJSON().slice(0, 10),
                    status: "COMPLETED"
                }
            ]
        }


        try {
            setLoading(true)
            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false,
                }
            })
            if (response?.status === "OK")
                navigate(`/knowledge-hub`)
        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        } finally {
            setLoading(false)
        }

    }

    /**
     * Init respective form sections once stages are fetched
     */
    useEffect(() => {
        if (stages?.length > 0) {
            setFormSections({
                createFile: findSectionObject({searchString: "Create", sectionArray: stages[0].sections}),
            })
        }
    }, [stages]);

    /**
     * Props for your form element
     * This enables us to send a form to the fileResources url so that we get a resource id back
     * @type {{maxCount: number, customRequest: ((function(*): Promise<void>)|*), accept: string}}
     */
    const fileUploadProps = {
        accept: ".pdf",
        maxCount: 1,
        beforeUpload: file => {
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M)
                notification.error({
                    message: "Document is too large"
                })
            return isLt5M
        },
        customRequest: async (options) => {
            const {onSuccess, onError, file} = options;
            const formData = new FormData()

            await formData.append("file", file)
            try {
                const response = await engine.mutate({
                    resource: "fileResources",
                    type: "create",
                    data: {
                        file,
                    },
                })
                if (response.httpStatusCode === 202) {
                    onSuccess("ok")
                    setFile(response.response.fileResource.id)
                }

            } catch (e) {
                onError(e)
            }
        }
    }


    const isHidden = (dataElementId) => {
        const dataElementObject = getDataElementByID(dataElementId)
        const hiddenAttributeIndex = dataElementObject.attributeValues.findIndex(attribute => attribute.attribute.name.toLowerCase().includes("hide"))
        if (hiddenAttributeIndex === -1)
            return false
        else {
            return true
        }
    }

    return (
        <Form
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish} form={form} layout="vertical" style={{position: "relative"}}>
            <CardItem title="AMS KNOWLEDGE HUB">

                <FormSection
                    checkIfHidden={isHidden}
                    overrideRequired={true}
                    fileUploadProps={fileUploadProps}
                    ordered={false}
                    containerStyles={styles.twoColumnWrapper}
                    section={formSections?.createFile}
                    layoutStyles={{width: "100%", gridColumn: "1/3"}}
                />

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