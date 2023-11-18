import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {Form, notification, Spin} from "antd";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";
import {FormSection} from "../Components/FormSection";
import styles from "../styles/FormSection.module.css"

const useStyles = createUseStyles({
    parentContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        position: "relative"
    },
    detailsContainer: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        gap: "1rem",
    },
    title: {
        justifySelf: "start",
        backgroundColor: "rgb(234, 238, 240)",
        color: "#1d5288",
        padding: ".5rem 1rem",
        fontWeight: "500",
        height: "fit-content",
        width: "100%",
        gridColumn: "1 / 3"
    },
    inputContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "4rem",
        padding: "1rem 1rem",
        width: "100%",
        "@media (min-width: 768px)": {
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem 12rem",
            padding: "1.5rem 3rem"
        }
    },
    formContainer: {
        display: "grid",
        minHeight: "65vh",
    },
    actionContainer: {
        display: "flex",
        justifyContent: "end",
        gap: "2rem",
        width: "100%",
        backgroundColor: "#E3EEF7",
        height: "fit-content",
        marginTop: "auto",
        padding: "4rem .5rem",
        position: "absolute",
        bottom: "0px",
        left: "0px",
        "@media (min-width: 768px)": {
            padding: "4rem 2rem",
        }
    },
    successButton: {
        color: "white",
        backgroundColor: "green",
        padding: ".5rem 2rem",
        borderRadius: "4px",
        outline: "none",
        border: "none",
        fontSize: "12px"
    },
    backButton: {
        color: "white",
        backgroundColor: "#1d5288",
        padding: ".5rem 2rem",
        borderRadius: "4px",
        outline: "none",
        border: "none",
        fontSize: "12px"
    },

})

export const NewForm = () => {
    // const styles = useStyles()
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
                        <FormSection containerStyles={styles.patientDetailsSection} section={formSections.patients} layoutStyles={{width: "100%", gridColumn: "1/3"}}/>
                    </div>


                    <FormSection section={formSections.antibiotics} layoutStyles={{width: "100%", gridColumn: "1/3"}}/>
                    <FormSection section={formSections.cultures} layoutStyles={{width: "100%", gridColumn: "1/3"}}/>
                    <FormSection section={formSections.dosage} layoutStyles={{width: "100%", gridColumn: "1/3"}}/>

                    <FormSection section={formSections.recommendation}
                                 layoutStyles={{width: "100%", gridColumn: "1/3"}}/>
                    <FormSection section={formSections.redFlags} layoutStyles={{width: "100%", gridColumn: "1/3"}}/>
                    <FormSection section={formSections.comments} layoutStyles={{width: "100%", gridColumn: "1/3"}}/>
                    <FormSection section={formSections.signature} layoutStyles={{width: "100%", gridColumn: "1/3"}}/>


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