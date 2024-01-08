import {useEffect, useState} from "react";
import {useDataEngine} from "@dhis2/app-runtime";
import {useNavigate, useParams} from "react-router-dom";
import {notification} from "antd";


export const useUpdateCategory = () => {

    const [option, setOption] = useState({})

    const [loading, setLoading] = useState(false)

    const engine = useDataEngine()

    const navigate = useNavigate()

    const {optionSetID, optionID} = useParams()

    const getOption = async () => {
        try {

            setLoading(true)

            const response = await engine.query({
                schema: {
                    resource: "options",
                    params: {
                        fields: "attributeValues,owner,value,attribute,id,name,displayName, code",
                        filter: `optionSet.id:eq:${optionSetID}`
                    }
                }
            })

            if (response.schema.options) {

                const item = response.schema.options.find(option => option.id === optionID)

                setOption(item)
            }

        } catch (e) {

            notification.error({
                message: "error",
                description: "Couldn't fetch options"
            })

        } finally {

            setLoading(false)

        }
    }

    const onFinish = async (values) => {
        try {

            setLoading(true)

            const payload = {
                ...option,
                name: values.name,
                optionSet: {
                    id: optionSetID
                }
            }

            const firstResponse = await engine.mutate({
                resource: "schemas/option",
                type: "create",
                data: payload
            })

            const secondResponse = await engine.mutate({
                resource: `options/${optionID}`,
                type: "update",
                data: payload,
                params: {
                    mergeMode: "REPLACE"
                }
            })

            if (firstResponse.status === "OK" && secondResponse.status === "OK")
                navigate(-1)

        } catch (e) {

            notification.error({
                message: "error",
                description: "Couldn't update"
            })

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {
        if (optionSetID)
            getOption()
    }, [optionSetID]);


    return {option, loading, onFinish, navigate}

}