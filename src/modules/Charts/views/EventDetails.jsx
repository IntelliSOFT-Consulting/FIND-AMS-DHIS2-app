import {CardItem} from "../../../shared/components/Cards/CardItem";

import styles from "../styles/ChartDetails.module.css"
import {SectionDisplay} from "../Components/SectionDisplay";
import {MultiSelectSectionDisplay} from "../Components/MultiSelectSectionDisplay";
import {TextAreaDisplay} from "../Components/TextAreaDisplay";
import {Spin} from "antd";
import {useEventDetails} from "../hooks/useEventDetails";


export const EventDetails = () => {

    const {
        formSections,
        patientIp,
        loading,
        data
    } = useEventDetails()
    return (
        <CardItem CardHeader={CardHeader} linkItems={linkItems}>
            <div className={styles.header}>PATIENT DETAILS</div>

            <div className={styles.parent}>
                {loading && (<Spin style={{margin: "auto", justifySelf: "center", alignSelf: "center"}}/>)}
                <SectionDisplay
                    containerStyles={styles.basicInfoWrapper}
                    itemsContainerStyles={styles.basicInfoItemWrapper}
                    nameContainerStyles={styles.basicInfoName}
                    valueContainerStyles={styles.basicInfoValue}
                    sectionForms={formSections.patients}
                    data={data?.events?.dataValues}
                />


                <SectionDisplay
                    ordered={true}
                    startingIndex={1}
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.antibiotics}
                    data={data?.events?.dataValues}
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
                    data={data?.events?.dataValues}
                />

                <SectionDisplay
                    ordered={true}
                    startingIndex={formSections.antibiotics?.dataElements?.length + 2}
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.dosage}
                    data={data?.events?.dataValues}
                />

                <MultiSelectSectionDisplay
                    number={formSections.antibiotics?.dataElements?.length + 1 + formSections.dosage?.dataElements?.length + 1}
                    data={data?.events?.dataValues}
                    sectionForms={formSections.recommendation}
                />


                <MultiSelectSectionDisplay
                    number={formSections.antibiotics?.dataElements?.length + 1 + formSections.dosage?.dataElements?.length + 2}
                    data={data?.events?.dataValues}
                    sectionForms={formSections.redFlags}
                />


                <TextAreaDisplay
                    sectionForms={formSections.comments}
                    data={data?.events?.dataValues}
                />



            </div>


        </CardItem>
    )
}