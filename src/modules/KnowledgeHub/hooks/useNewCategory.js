import {useState} from "react";
import {useDataEngine} from "@dhis2/app-runtime";
import {useNavigate, useParams} from "react-router-dom";
import {notification} from "antd";


export const useNewCategory = () => {

    const [loading, setLoading] = useState(false)

    const engine = useDataEngine()

    const navigate = useNavigate()

    const {optionSetID} = useParams()

    const onFinish = async values => {
        setLoading(true)

        try {

            const payload = {
                code: values.name.toLowerCase(),
                name: values.name,
                optionSet: {
                    id: optionSetID
                }
            }

            const firstResponse = await engine.mutate({
                resource: "schemas/option",
                type: "create",
                data: payload,
            })

            if (firstResponse.status === "OK") {
                const response = await engine.mutate({
                    resource: "options",
                    type: "create",
                    data: payload,
                })
                if (response?.status === "OK"){
                    navigate(`/knowledge-hub`)
                }

            }

        } catch (e) {

            notification.error({
                message: "Something went wrong"
            })

        }finally {
            setLoading(false)
        }
    }


    return {loading, onFinish}

}