import {useSelector} from "react-redux";
import {useForm} from "antd/es/form/Form";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {notification} from "antd";
import {useDataEngine} from "@dhis2/app-runtime";
import {useDataElements} from "./useDataElements";


export const useUploadDocument = () => {
    const [loading, setLoading] = useState(false)

    const [file, setFile] = useState({})

    const {formSections, program, dataElements} = useSelector(state => state.microbiology)

    const user = useSelector(state => state.user)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const [form] = useForm()

    const navigate = useNavigate()

    const engine = useDataEngine()

    const {getDataElementByID, getDataElementByName} = useDataElements()


    const fileUploadProps = {
        accept: ".txt",
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

    const isHidden = dataElementId => {
        const dataElementObject = getDataElementByID(dataElementId)

        const hiddenAttributeIndex = dataElementObject.attributeValues.findIndex(attribute => attribute.attribute.name.toLowerCase().includes("hide"))

        if (hiddenAttributeIndex === -1) return false
        else return true
    }

    const onFinish = async values => {
        try {
            setLoading(true)
            if (!file)
                return notification.info({
                    message: "Please upload a file"
                })

            let dataValues = Object.keys(values).map(key => ({
                dataElement: key,
                value: values[key]
            }))

            dataValues = dataValues.filter(dataValue => dataValue.value !== undefined)


            dataValues.push({
                dataElement: getDataElementByName("Microbiology file").id,
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
                        program: program,
                        programStage: formSections[0]?.id,
                        orgUnit: orgUnitID,
                        dataValues,
                        completedAt: new Date().toJSON().slice(0, 10),
                        status: "COMPLETED"
                    }
                ]
            }

            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false
                }
            })

            if (response.status === "OK")
                navigate("/microbiology-data")

        } catch (e) {
            notification.error({
                message: "error",
                description: "Couldn't create"
            })
        } finally {
            setLoading(false)
        }
    }

    return {
        formSections,
        form,
        loading,
        navigate,
        fileUploadProps,
        isHidden,
        onFinish
    }

}