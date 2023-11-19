import {CardItem} from "../../../shared/components/cards/CardItem";
import {useEffect, useState} from "react";
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {findSectionObject} from "../helpers";
import styles from "../styles/ChartDetails.module.css"
import {SectionDisplay} from "../Components/SectionDisplay";
import {MultiSelectSectionDisplay} from "../Components/MultiSelectSectionDisplay";
import {TextAreaDisplay} from "../Components/TextAreaDisplay";


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


    const navigate = useNavigate()

    const {eventId} = useParams()

    useEffect(() => {
        query.events.resource = `tracker/events/${eventId}`
    }, [eventId]);


    const {loading, data, refetch, error} = useDataQuery(query)

    const {stages, program} = useSelector(state => state.forms)


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


    return (
        <CardItem title={`AMS CHART REVIEW: FORM ${data?.events?.event}`}>
            <div className={styles.header}>PATIENT DETAILS</div>

            <div className={styles.parent}>
                <SectionDisplay
                    containerStyles={styles.basicInfoWrapper}
                    itemsContainerStyles={styles.basicInfoItemWrapper}
                    nameContainerStyles={styles.basicInfoName}
                    valueContainerStyles={styles.basicInfoValue}
                    sectionForms={formSections.patients}
                    data={data?.events?.dataValues}
                />


                <SectionDisplay
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.antibiotics}
                    data={data?.events?.dataValues}
                />


                <SectionDisplay
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.cultures}
                    data={data?.events?.dataValues}
                />

                <SectionDisplay
                    containerStyles={styles.genericWrapper}
                    itemsContainerStyles={styles.genericItemWrapper}
                    nameContainerStyles={styles.genericName}
                    valueContainerStyles={styles.genericValue}
                    sectionForms={formSections.dosage}
                    data={data?.events?.dataValues}
                />

                <MultiSelectSectionDisplay
                    data={data?.events?.dataValues}
                    sectionForms={formSections.recommendation}
                />


                <MultiSelectSectionDisplay
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