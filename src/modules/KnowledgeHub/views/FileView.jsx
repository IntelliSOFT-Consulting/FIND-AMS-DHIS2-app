import {CardItem} from "../../../shared/components/cards/CardItem";
import {useNavigate, useParams} from "react-router-dom";
import styles from "../styles/FileView.module.css"
import {Viewer, Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";
import {useConfig, useDataEngine, useDataQuery} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";
import {getDataElementObjectByID} from "../../../shared/helpers/formatData";
import {useSelector} from "react-redux";
import {notification, Spin} from "antd";
import {downloadPDF} from "../helpers";

const query = {
    events: {
        resource: ``,
    }
}




export const FileView = () => {
    const [document, setDocument] = useState([])

    const {baseUrl, apiVersion} = useConfig()

    const {stages} = useSelector(state => state.knowledgeHub)

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const {eventId} = useParams()

    const {data, loading} = useDataQuery(query)



    useEffect(() => {
        query.events.resource = `tracker/events/${eventId}`
    }, [eventId]);

    useEffect(() => {
        if (data) {
            data?.events?.dataValues.forEach(dataValue => {
                const dataElement = getDataElementObjectByID({
                    elementId: dataValue.dataElement, dataElements: stages[0]?.sections[0]?.dataElements
                })
                setDocument(prev => [...prev, {...dataElement, value: dataValue.value}])
            })
        }
    }, [data]);



    const getDocument = (name) => {
        const item = document.find(doc => doc.name.toLowerCase().includes(name.toLowerCase()))
        return item
    }

    const engine = useDataEngine()

    const handleDownload = async () => {
        const fileName = getDocument("Name")?.value
        try {
            const response = await engine.query({
                events: {
                    resource: "/events/files",
                    params: {
                        dataElementUid: getDocument("file")?.id,
                        eventUid: eventId
                    }
                }
            })

            await downloadPDF({fileBlob: response.events, documentName: fileName})

        } catch (e) {
            notification.error({
                message: "Download failed"
            })
        }
    }


    const Header = () => {
        const navigate = useNavigate()

        return (<div className="card-header">
            <p className="card-header-text">AMS KNOWLEDGE HUB</p>
            <div className={styles.headerButtonsWrapper}>
                <button
                    onClick={handleDownload}
                    className={styles.successButton}
                >
                    DOWNLOAD
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className={styles.backButton}
                >
                    BACK
                </button>
            </div>

        </div>)
    }


    return (
        <CardItem title={Header()}>
            {
                loading ?
                    <div style={{width: "100%", display: "flex", justifyContent: "center", padding: "2rem"}}>
                        <Spin/>
                    </div>
                    : (
                        <>
                            <div className={styles.parentWrapper}>
                                <div className={styles.detailContainer}>
                                    <div className={styles.keyElement}>Document Name:</div>
                                    <div className={styles.valueElement}>{getDocument("Name")?.value}</div>
                                    <div className={styles.keyElement}>Document Permissions:</div>
                                    <div className={styles.valueElement}>{getDocument("Permission")?.value}</div>
                                    <div className={styles.keyElement}>Category</div>
                                    <div className={styles.valueElement}>{getDocument("Category")?.value}</div>
                                </div>

                                <div className={styles.detailContainer}>
                                    <div className={styles.keyElement}>Description:</div>
                                    <div className={styles.valueElement}>{getDocument("Description")?.value}</div>
                                </div>
                            </div>

                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js">
                                <Viewer
                                    id="viewer"
                                    withCredentials={true}
                                    httpHeaders={{
                                        Authorization: `Basic ` + btoa("admin" + ":" + "district")
                                    }}
                                    plugins={[defaultLayoutPluginInstance]}
                                    fileUrl={`${baseUrl}/api/${apiVersion}/events/files?dataElementUid=${getDocument("file")?.id}&eventUid=${eventId}`}
                                />
                            </Worker>
                        </>
                    )
            }
        </CardItem>
    )
}