import {CardItem} from "../../../shared/components/Cards/CardItem";
import {useNavigate} from "react-router-dom";
import styles from "../styles/FileView.module.css"
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {Spin} from "antd";
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {useFileView} from "../hooks/useFileView";
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";




export const FileView = () => {

    const {base64String, handleDownloads, loading, getFormElement} = useFileView()

    const defaultLayoutPluginInstance = defaultLayoutPlugin();


    /**
     * Card header
     * @returns {JSX.Element}
     * @constructor
     */
    const Header = () => {
        const navigate = useNavigate()

        return (<div className="card-header">
            <p className="card-header-text">AMS KNOWLEDGE HUB</p>
            <div className={styles.headerButtonsWrapper}>
                <button
                    onClick={handleDownloads}
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
        <CardItem CardHeader={Header}>
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
                                    <div className={styles.valueElement}>{getFormElement("Name")?.value}</div>
                                    <div className={styles.keyElement}>Document Permissions:</div>
                                    <div className={styles.valueElement}>{getFormElement("Permission")?.value}</div>
                                    <div className={styles.keyElement}>Category</div>
                                    <div className={styles.valueElement}>{getFormElement("Category")?.value}</div>
                                </div>

                                <div className={styles.detailContainer}>
                                    <div className={styles.keyElement}>Description:</div>
                                    <div className={styles.valueElement}>{getFormElement("Description")?.value}</div>
                                </div>
                            </div>

                            {base64String.length > 0 && (
                                <Worker
                                    workerUrl="https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js">
                                    <Viewer

                                        plugins={[defaultLayoutPluginInstance]}
                                        fileUrl={`data:application/pdf;base64,${base64String}`}
                                    />
                                </Worker>
                            )}

                        </>
                    )
            }
        </CardItem>
    )
}