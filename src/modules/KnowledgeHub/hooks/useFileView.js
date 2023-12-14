import {useEffect, useState} from "react";
import {useBase64} from "../../../shared/helpers/fileOperations";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";
import {notification} from "antd";
import {useDataElements} from "./useDataElements";
import {downloadPDF} from "../helpers";

export const useFileView = () => {

    const [formElements, setFormElements] = useState([])

    const [loading, setLoading] = useState(false)

    const {base64String, convertBlobToBase64} = useBase64()

    const {stages} = useSelector(state => state.knowledgeHub)

    const {eventId} = useParams()

    const engine = useDataEngine()

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

    useEffect(() => {
        if (eventId && stages) {
            getEvent()
            fetchFile()
        }
    }, [eventId, stages]);

    return {
        formElements,
        base64String,
        handleDownloads,
        loading,
        getFormElement,
    }


}