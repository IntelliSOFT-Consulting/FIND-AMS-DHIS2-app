import {CardItem} from "../../../shared/components/Cards/CardItem";
import styles from "../styles/ChartDetails.module.css"
import {SectionDisplay} from "../Components/SectionDisplay";
import {MultiSelectSectionDisplay} from "../Components/MultiSelectSectionDisplay";
import {TextAreaDisplay} from "../Components/TextAreaDisplay";
import {Spin} from "antd";
import {useEventDetails} from "../hooks/useEventDetails";
import {Link, useNavigate} from "react-router-dom";


export const EventDetails = () => {

    const {
        formSections,
        patientIp,
        loading,
        data,
        convertToPdfAndDownload
    } = useEventDetails()

    const CardHeader = () => {
        const navigate = useNavigate()
        return (
            <div className={styles.cardHeader}>
                <p className="">{`AMS CHART REVIEW: FORM ${patientIp}`}</p>
                <div className={styles.buttonWrapper}>
                    <button
                        onClick={convertToPdfAndDownload}
                        className={styles.successButton}>
                        Download
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="outline-btn">Back
                    </button>
                </div>

            </div>
        )
    }

    const linkItems = [
        {
            title: <Link to="/charts">Charts</Link>
        },
        {
            title: "Chart review details"
        },
    ]

    return (

        <CardItem CardHeader={CardHeader} linkItems={linkItems}>
        <div className={styles.header}>PATIENT DETAILS</div>

            <div id="eventPage" className={styles.parent}>
                {loading && (<Spin style={{margin: "auto", justifySelf: "center", alignSelf: "center"}}/>)}
                <SectionDisplay
                    containerStyles={styles.basicInfoWrapper}
                    itemsContainerStyles={styles.basicInfoItemWrapper}
                    nameContainerStyles={styles.basicInfoName}
                    valueContainerStyles={styles.basicInfoValue}
                    sectionForms={formSections.patients}
                    data={data?.events?.enrollments[0].attributes}
                />


                <SectionDisplay
                    ordered={true}
                    startingIndex={1}
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.antibiotics}
                    data={data?.events?.enrollments[0].attributes}
                />


                <SectionDisplay
                    ordered={true}
                    startingIndex={formSections.antibiotics?.dataElements?.length + 1}
                    alphabet={true}
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.cultures}
                    data={data?.events?.enrollments[0].attributes}
                />

                <SectionDisplay
                    ordered={true}
                    startingIndex={formSections.antibiotics?.dataElements?.length + 2}
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.dosage}
                    data={data?.events?.enrollments[0].attributes}
                />

                <MultiSelectSectionDisplay
                    number={formSections.antibiotics?.dataElements?.length + 1 + formSections.dosage?.dataElements?.length + 1}
                    data={data?.events?.enrollments[0].events}
                    sectionForms={formSections.recommendation}
                />


                <MultiSelectSectionDisplay
                    number={formSections.antibiotics?.dataElements?.length + 1 + formSections.dosage?.dataElements?.length + 2}
                    data={data?.events?.enrollments[0].events}
                    sectionForms={formSections.redFlags}
                />


                <TextAreaDisplay
                    sectionForms={formSections.comments}
                    data={data?.events?.enrollments[0].attributes}
                />


            </div>


        </CardItem>
    )
}