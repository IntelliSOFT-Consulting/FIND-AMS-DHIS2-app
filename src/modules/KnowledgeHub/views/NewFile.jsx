import {CardItem} from "../../../shared/components/cards/CardItem";
import {useSelector} from "react-redux";
import {Form, notification, Spin} from "antd";
import {useEffect, useState} from "react";
import styles from "../styles/NewFile.module.css"
import {useDataEngine} from "@dhis2/app-runtime";
import {useNavigate} from "react-router-dom";
import {FormSection} from "../../../shared/components/Forms/FormSection";

export const NewFile = () => {


    const {stages, program} = useSelector(state => state.knowledgeHub)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const [form] = Form.useForm()


    const engine = useDataEngine()
    const navigate = useNavigate()

    const [formSection, setFileSection] = useState({})
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (stages)
            setFileSection(stages[0]?.sections[0])
    }, [stages]);


    const sendFile = (file) => new Promise(async (resolve, reject) => {
        const formData = new FormData()

        formData.append("file", file?.file)


        const response = await engine.mutate({
            resource: "fileResources",
            data: formData
        })

        if (response.status === "OK")
            resolve(response.response.id)

        else reject(response)
    })


    const onFinish = async (values) => {
        console.log('values', values)
        const formElements = formSection?.dataElements.filter(dataElement => dataElement.valueType == "FILE_RESOURCE").map(dataElement => dataElement.id)
        console.log('form elements', formElements)

        /**
         * First add the single answer values
         * @type {{dataElement: *, value: *}[]}
         */
        const dataValues = Object.keys(values).map(async (dataElement) => {
            if (formElements.includes(dataElement)) {
                try {
                    const id = await sendFile(values[dataElement])
                    return {
                        dataElement: dataElement,
                        value: id
                    }
                } catch (e) {
                    console.log('e', e)
                }
            } else {
                return {
                    dataElement,
                    value: values[dataElement]
                }
            }
        })


        const payload = {
            events: [
                {
                    "occurredAt": new Date().toJSON().slice(0, 10),
                    "notes": [],
                    program,
                    "programStage": stages[0].id,
                    orgUnit: orgUnitID,
                    dataValues
                }
            ]
        }

        try {
            setLoading(true)
            // const response = await engine.mutate({
            //     resource: "tracker",
            //     type: "create",
            //     data: payload,
            //     params: {
            //         async: false,
            //     }
            // })
            // if (response?.status === "OK") {
            //     // navigate(`/charts`)
            // }
        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        } finally {
            setLoading(false)
        }
    }


    const fileUploadProps = {
        name: "file",
        // customRequest: async options => {
        //     const {onSuccess, onError, file, onProgress} = options
        //     try {
        //         const payload = new FormData()
        //         payload.append("file", file)
        //         console.log("form data", payload)
        //         // const response = await engine.mutate({
        //         //     resource: "fileResources",
        //         //     data: payload,
        //         //     type: "create",
        //         // })
        //         // if (response.status === "OK")
        //         //     return (response.response.id)
        //     } catch (e) {
        //         console.log('e', e)
        //         notification.error({
        //             message: "error"
        //         })
        //     }
        // },
        onChange: async (evt) => {
            // console.log('engine', engine)

        }
    }


    return (
        <Form onFinish={onFinish} form={form} layout="vertical" style={{position: "relative"}}>
            <CardItem title="AMS KNOWLEDGE HUB">


                <FormSection
                    fileUploadProps={fileUploadProps}
                    containerStyles={styles.twoColumnWrapper}
                    ordered={false}
                    section={formSection}
                />


                <div className={styles.actionContainer}>
                    {loading ? (
                        <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
                    ) : (
                        <>
                            <button type="button" onClick={() => navigate(-1)} className={styles.backButton}>BACK
                            </button>
                            <button type="submit" className={styles.successButton}>SUBMIT</button>
                        </>
                    )}
                </div>
            </CardItem>
        </Form>
    )
}