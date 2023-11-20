import {CardItem} from "../../../shared/components/cards/CardItem";
import {useNavigate} from "react-router-dom";
import styles from "../styles/FileView.module.css"
import {Viewer, Worker} from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import pdf from "../../../shared/assets/sample.pdf"
import {defaultLayoutPlugin} from "@react-pdf-viewer/default-layout";

const Header = () => {
    const navigate = useNavigate()

    return (
        <div className="card-header">
            <p className="card-header-text">AMS KNOWLEDGE HUB</p>
            <div className={styles.headerButtonsWrapper}>
                <button
                    onClick={() => navigate("/charts/members-present-form")}
                    className={styles.successButton}
                >
                    DOWNLOAD
                </button>
                <button
                    onClick={() => navigate("/charts/members-present-form")}
                    className={styles.backButton}
                >
                    BACK
                </button>
            </div>

        </div>
    )
}

export const FileView = () => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <CardItem title={Header()}>
            <div className={styles.parentWrapper}>
                <div className={styles.detailContainer}>
                    <div className={styles.keyElement}>Document Name:</div>
                    <div className={styles.valueElement}>MOH ANTIMICROBIAL GUIDELINES V2</div>
                    <div className={styles.keyElement}>Document Permissions:</div>
                    <div className={styles.valueElement}>Public Document</div>
                    <div className={styles.keyElement}>Category</div>
                    <div className={styles.valueElement}>Training Material</div>
                </div>

                <div className={styles.detailContainer}>
                    <div className={styles.keyElement}>Description:</div>
                    <div className={styles.valueElement}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisi porta lorem mollis aliquam ut
                        porttitor leo. Urna nunc id cursus metus. Ultricies lacus sed turpis tincidunt id aliquet risus.
                        Diam vel quam elementum pulvinar etiam non quam. Fermentum odio eu feugiat pretium nibh ipsum
                        consequat nisl. Nibh sit amet commodo nulla. Purus gravida quis blandit turpis cursus in hac
                        habitasse platea. Vulputate eu scelerisque felis imperdiet. Egestas erat imperdiet sed euismod
                        nisi porta lorem mollis aliquam. Imperdiet nulla malesuada pellentesque elit eget gravida. Ut
                        etiam sit amet nisl purus in mollis nunc sed.
                    </div>
                </div>
            </div>

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                    plugins={[defaultLayoutPluginInstance]}
                    fileUrl={pdf} />
            </Worker>

        </CardItem>
    )
}