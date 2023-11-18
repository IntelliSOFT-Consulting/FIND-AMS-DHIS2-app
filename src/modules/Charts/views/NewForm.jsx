import {CardItem} from "../../../shared/components/cards/CardItem";
import {Form, notification, Spin} from "antd";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";
import {FormSection} from "../Components/FormSection";
import styles from "../styles/FormSection.module.css"
import {MultiSelectSection} from "../Components/MultiSelectSection";


export const NewForm = () => {
    const [form] = Form.useForm()

    const {eventId} = useParams()

    const engine = useDataEngine()
    const navigate = useNavigate()

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

    const [loading, setLoading] = useState(false)


    const {stages, program} = useSelector(state => state.forms)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)


    /**
     * Finds a section object by searching through the stages for a specific title
     * @param searchString
     * @param sectionArray
     * @returns {*}
     */
    const findSectionObject = ({searchString, sectionArray}) => {
        return sectionArray.find(section => section.title.toLowerCase().includes(searchString.toLowerCase()))
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

    const onFinish = async (values) => {
        const payload = {
            events: [
                {
                    "occurredAt": new Date().toJSON().slice(0, 10),
                    "notes": [],
                    program,
                    "programStage": stages[0].id,
                    orgUnit: orgUnitID,
                    event: eventId,
                    dataValues: Object.keys(values).map(key => ({
                        dataElement: key,
                        value: values[key]
                    })),
                }
            ]
        }

        try {
            setLoading(true)
            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false,
                    importStrategy: "UPDATE"
                }
            })
            if (response?.status === "OK") {
                navigate(`/charts`)
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

    return (
        <Form onFinish={onFinish} form={form} layout="vertical" style={{position: "relative"}}>
            <CardItem title="AMS CHART REVIEW: NEW FORM">
                <div className={styles.parentContainer}>
                    <div className={styles.patientDetailsWrapper}>
                        <div className={styles.title}>PATIENT DETAILS</div>
                        <FormSection
                            ordered={false}
                            containerStyles={styles.patientDetailsSection}
                            section={formSections.patients}
                            layoutStyles={{width: "100%", gridColumn: "1/3"}}
                        />
                    </div>

                    <div className={styles.twoColumnWrapper}>
                        <FormSection
                            section={formSections.antibiotics}
                            layoutStyles={{width: "100%", gridColumn: "1/3"}}
                        />
                        <FormSection
                            section={formSections.cultures}
                            listStyle="a"
                            placeholderNumber={formSections.antibiotics?.dataElements?.length + 1}
                            containerStyles={styles.culturesSection}
                        />
                    </div>


                    <FormSection
                        containerStyles={styles.dosageSection}
                        startingIndex={formSections.antibiotics?.dataElements?.length + 2}
                        section={formSections.dosage}
                    />


                    <MultiSelectSection
                        number={formSections.antibiotics?.dataElements?.length + 2 + formSections.dosage?.dataElements?.length}
                        section={formSections.recommendation}
                    />

                    <MultiSelectSection
                        number={formSections.antibiotics?.dataElements?.length + 2 + formSections.dosage?.dataElements?.length + 1}
                        section={formSections.redFlags}
                    />


                    <FormSection
                        ordered={false}
                        containerStyles={styles.commentsSection}
                        section={formSections.comments}
                    />
                    <FormSection
                        ordered={false}
                        containerStyles={styles.commentsSection}
                        section={formSections.signature}
                    />


                </div>
                <div className={styles.actionContainer}>
                    {loading ? (
                        <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
                    ) : (
                        <>
                            <button type="button" onClick={() => navigate(-1)} className={styles.backButton}>BACK
                            </button>
                            <button type="submit" className={styles.successButton}>SUBMIT</button>
                        </>
                    )}

                </div>
            </CardItem>

        </Form>

    )
}