import {useEffect, useState} from "react";
import {useBase64} from "../../../shared/helpers/fileOperations";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";
import {notification} from "antd";
import {useDataElements} from "./useDataElements";
import {downloadPDF} from "../helpers";

export const useFileView = () => {

    const [formElements, setFormElements] = useState([])

    const [updateObject, setUpdateObject] = useState({
        name: "",
        description: ""
    })

    const [inputStates, setInputStates] = useState({
        isNameDisabled: true,
        isDescriptionDisabled: true
    })

    const [loading, setLoading] = useState(false)

    const {base64String, convertBlobToBase64} = useBase64()

    const {stages, program} = useSelector(state => state.knowledgeHub)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const {eventId} = useParams()

    const engine = useDataEngine()

    const navigate = useNavigate()

    const {getDataElementByName, getDataElementByID} = useDataElements()

    const getFormElement = (name) => {
        const item = formElements?.find(doc => doc?.name?.toLowerCase()?.includes(name?.toLowerCase()))
        return item
    }


    const getEvent = async () => {

        setLoading(true)

        try {
            const response = await engine.query({
                data: {
                    resource: `tracker/events/${eventId}`
                }
            })


            if (response.data) {
                response?.data?.dataValues?.forEach(dataValue => {

                    const dataElementObject = getDataElementByID(dataValue.dataElement)

                    setFormElements(prev => [...prev,
                        {
                            name: dataElementObject?.displayName,
                            value: dataValue.value,
                            valueType: dataElementObject?.valueType
                        }
                    ])

                })
            }

        } catch (e) {

            notification.error({
                message: "Error",
                description: "Couldn't get the event"
            })

        } finally {

            setLoading(false)

        }

    }

    const fetchFile = async () => {

        setLoading(true)

        try {

            const response = await engine.query({
                events: {
                    resource: "events/files",
                    params: {
                        dataElementUid: getDataElementByName("file")?.id,
                        eventUid: eventId
                    }
                }
            })

            convertBlobToBase64(response.events)

            return response.events

        } catch (e) {

            notification.error({
                message: "Error",
                description: "Couldn't get the file"
            })

        } finally {

            setLoading(false)

        }

    }

    const handleDownloads = async () => {

        setLoading(true)

        const fileName = getFormElement("Name")?.value

        try {

            const blob = await fetchFile()

            await downloadPDF({fileBlob: blob, documentName: fileName})

        } catch (e) {

            notification.error({
                message: "Error",
                description: "Download failed"
            })

        } finally {

            setLoading(false)

        }

    }

    const editDetails = async () => {
        try {

            setLoading(true)

            const nameDataElement = getDataElementByName("name")
            const descriptionDataElement = getDataElementByName("description")

            const dataValues = [
                {
                    dataElement: nameDataElement.id,
                    value: updateObject.name || getFormElement("name")?.value
                },
                {
                    dataElement: descriptionDataElement.id,
                    value: updateObject.description || getFormElement("name")?.value
                },
            ]

            const payload = {
                events: [{
                    "occurredAt": new Date().toJSON().slice(0, 10),
                    "notes": [],
                    program,
                    "programStage": stages[0].id,
                    orgUnit: orgUnitID,
                    event: eventId, dataValues
                }]
            }

            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false,
                    importStrategy: "UPDATE",
                    partial: true
                }
            })

            if(response?.status === "OK"){
                notification.success({
                    message: "success",
                    description: "Edit success"
                })

                setInputStates({
                    isNameDisabled: true,
                    isDescriptionDisabled: true
                })
            }

        } catch (e) {

            notification.error({
                message: "error",
                description: "Something went wrong"
            })

        } finally {

            setLoading(false)

        }
    }

    useEffect(() => {
        if (eventId && stages) {
            getEvent()
            fetchFile()
        }
    }, [eventId, stages]);

    useEffect(() => {
        if (formElements.length > 0) {
            setUpdateObject({
                name: getFormElement("name")?.value,
                description: getFormElement("description")?.value
            })
        }
    }, [formElements]);

    return {
        setUpdateObject,
        updateObject,
        formElements,
        base64String,
        handleDownloads,
        loading,
        getFormElement,
        inputStates,
        setInputStates,
        editDetails
    }


}