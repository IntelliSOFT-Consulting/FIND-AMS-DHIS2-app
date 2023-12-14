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
            setFile(file)
            onSuccess("ok")
        }
    }

    const isHidden = dataElementId => {
        const dataElementObject = getDataElementByID(dataElementId)

        const hiddenAttributeIndex = dataElementObject.attributeValues.findIndex(attribute => attribute.attribute.name.toLowerCase().includes("hide"))

        if (hiddenAttributeIndex === -1) return false
        else return true
    }

    const onFinish = () => {
        const formData = new FormData()
        formData.append("fileContent", file)
        setLoading(true)

        fetch("https://4ace-102-219-208-30.ngrok-free.app/api/find-ams/file-import/parse-file", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(response => {
                if (response.scanAvailable) {
                    notification.info({
                        message: "success",
                        description: "Upload successful"
                    })
                    navigate("/microbiology-data")
                }

            })
            .catch(error => {
                notification.error({
                    message: "error",
                    description: "Something went wrong during the upload"
                })
            })
            .finally(() => {
                setLoading(false)

            })
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