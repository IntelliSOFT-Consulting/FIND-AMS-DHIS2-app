import {CardItem} from "../../../shared/components/cards/CardItem";
import {useEffect, useState} from "react";
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {findSectionObject} from "../helpers";
import styles from "../styles/ChartDetails.module.css"
import {SectionDisplay} from "../Components/SectionDisplay";
import {MultiSelectSectionDisplay} from "../Components/MultiSelectSectionDisplay";
import {TextAreaDisplay} from "../Components/TextAreaDisplay";
import {formatChartData} from "../../../shared/helpers/formatData";
import {Spin} from "antd";


const query = {
    events: {
        resource: ``,
    }
}


export const EventDetails = () => {
    /**
     * Form section State hook
     */
    const [formSections, setFormSections] = useState({
        patients: {},
        antibiotics: {},
        cultures: {},
        dosage: {},
        recommendation: {},
        redFlags: {},
        comments: {},
        signature: {},
    })
    const [patientIp, setPatientIp] = useState("")


    const {eventId} = useParams()

    useEffect(() => {
        query.events.resource = `tracker/events/${eventId}`
    }, [eventId]);


    const {data, loading} = useDataQuery(query)

    const {stages} = useSelector(state => state.forms)

    /**
     * Get patient ip for use in form title
     * First get the element id for the Ip from the data elements
     * Then use that to find the data value in the event array
     */
    const getPatientIP = () => {
        if (formSections.patients?.dataElements) {
            const ipElement = formSections?.patients?.dataElements?.find(element => element?.name.includes("IP/OP"))
            const value = formatChartData({
                dataElement: ipElement.id,
                dataValues: data?.events?.dataValues
            })
            setPatientIp(value)
        }
    }


    /**
     * Init respective form sections once stages are fetched
     */
    useEffect(() => {
        if (stages?.length > 0) {
            setFormSections({
                patients: findSectionObject({searchString: "Patients", sectionArray: stages[0].sections}),
                antibiotics: findSectionObject({searchString: "Antibiotics", sectionArray: stages[0].sections}),
                cultures: findSectionObject({searchString: "Cultures", sectionArray: stages[0].sections}),
                dosage: findSectionObject({searchString: "Dosage", sectionArray: stages[0].sections}),
                recommendation: findSectionObject({searchString: "Recommendation", sectionArray: stages[0].sections}),
                redFlags: findSectionObject({searchString: "Flags", sectionArray: stages[0].sections}),
                comments: findSectionObject({searchString: "Comments", sectionArray: stages[0].sections}),
                signature: findSectionObject({searchString: "signature", sectionArray: stages[0].sections}),
            })

        }
    }, [stages]);


    /**
     * Set the patient Ip when the event object is fetched or when the data elements are fetched
     */
    useEffect(() => {
        getPatientIP()
    }, [formSections, data]);

    return (
        <CardItem title={`AMS CHART REVIEW: FORM ${patientIp}`}>
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