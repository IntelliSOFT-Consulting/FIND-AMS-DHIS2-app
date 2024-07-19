import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useDataElements} from "./useDataElements";
import {Form, notification} from "antd";
import {useDataEngine} from "@dhis2/app-runtime";
import {useNavigate} from "react-router-dom";
import {findSectionObject} from "../../../shared/helpers";

export const useNewFile = () => {

    const [formSections, setFormSections] = useState({createFile: {}})

    const [loading, setLoading] = useState(false)

    const [file, setFile] = useState(null)

    const {stages, program} = useSelector(state => state.knowledgeHub)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const user = useSelector(state => state.user)

    const {getDataElementByID, getDataElementByName} = useDataElements()

    const [form] = Form.useForm()

    const engine = useDataEngine()

    const navigate = useNavigate()

    const getFormElementID = () => {
        if (formSections.createFile?.dataElements) {
            const formElement = formSections?.createFile?.dataElements?.find(element => element?.valueType?.includes("FILE"))
            return formElement?.id
        }
    }

    const onFinish = async values => {
        if (!file)
            return notification.error({
                message: "Please upload a file"
            })

        let dataValues = Object.keys(values).map(key => ({
            dataElement: key,
            value: values[key]
        }))

        dataValues = dataValues.filter(dataValue => dataValue.value !== undefined)

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

    const fileUploadProps = {
        accept: ".pdf",
        maxCount: 1,
        beforeUpload: file => {
            const isLt5M = file.size / 1024 / 1024 < 5

            if (!isLt5M)
                notification.error({
                    message: "Document is too large"
                })


            if (file.type !== "application/pdf")
                notification.error({
                    message: "Please upload a pdf"
                })

            return (isLt5M && (file.type === "application/pdf"))
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
        const hiddenAttributeIndex = dataElementObject?.attributeValues.findIndex(attribute => attribute.attribute.name.toLowerCase().includes("hide"))
        if (hiddenAttributeIndex === -1)
            return false
        else {
            return true
        }
    }

    useEffect(() => {
        if (stages?.length > 0)
            setFormSections({
                createFile: findSectionObject({searchString: "Create", sectionArray: stages[0].sections}),
            })
    }, [stages]);

    return {
        formSections,
        file,
        form,
        navigate,
        loading,
        getFormElementID,
        onFinish,
        fileUploadProps,
        isHidden
    }


}