import {CardItem} from "../../../shared/components/Cards/CardItem";
import {useNavigate} from "react-router-dom";
import styles from "../styles/FileView.module.css"
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {Button, Input, Spin} from "antd";
import {Viewer, Worker} from "@react-pdf-viewer/core";
import {useFileView} from "../hooks/useFileView";
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";
import {PencilSquareIcon} from "@heroicons/react/20/solid";


export const FileView = () => {

    const {
        base64String,
        handleDownloads,
        loading,
        getFormElement,
        updateObject,
        setUpdateObject,
        inputStates,
        setInputStates,
        editDetails
    } = useFileView()

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
                                    <div className={styles.inputWrapper}>
                                        <Input
                                            onChange={(evt) => setUpdateObject(prev => ({...prev, name: evt.target.value}))}
                                            disabled={inputStates.isNameDisabled}
                                            value={updateObject.name}
                                            className={styles.input}
                                        />
                                        <PencilSquareIcon
                                            onClick={() => setInputStates(prev => ({
                                                ...prev,
                                                isNameDisabled: !prev.isNameDisabled
                                            }))}
                                            className={styles.icon}
                                        />
                                    </div>

                                    <div className={styles.keyElement}>Document Permissions:</div>
                                    <div className={styles.valueElement}>{getFormElement("Permission")?.value}</div>
                                    <div className={styles.keyElement}>Category</div>
                                    <div className={styles.valueElement}>{getFormElement("Category")?.value}</div>
                                </div>

                                <div className={styles.detailContainer}>
                                    <div className={styles.keyElement}>Description:</div>
                                    <div className={styles.textAreaWrapper}>
                                        <Input.TextArea
                                            onChange={(evt) => setUpdateObject(prev => ({...prev, description: evt.target.value}))}
                                            disabled={inputStates.isDescriptionDisabled}
                                            value={updateObject.description}
                                            className={styles.input}
                                        />
                                        <PencilSquareIcon
                                            onClick={() => setInputStates(prev => ({
                                                ...prev,
                                                isDescriptionDisabled: !prev.isDescriptionDisabled
                                            }))}
                                            className={styles.icon}
                                        />
                                    </div>
                                </div>
                                <button type="button" onClick={editDetails}  className={styles.saveButton}>SAVE</button>
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