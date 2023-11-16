import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {Form, Input, notification, Spin} from "antd";
import {useSelector} from "react-redux";
import InputItem from "../../../shared/components/Fields/InputItem";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";


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
    const styles = useStyles()
    const [form] = Form.useForm()

    const engine = useDataEngine()
    const navigate = useNavigate()

    /**
     * Form section State hooks
     */
    const [patientDetailsSection, setPatientDetailsSection] = useState({})
    const [questionSection, setQuestionSection] = useState({})
    const [recommendationSection, setRecommendationSection] = useState({})
    const [redFlagsSection, setRedFlagsSection] = useState({})
    const [loading, setLoading] = useState(false)


    const {stages, program} = useSelector(state => state.forms)
    const {id: orgUnitID} = useSelector(state => state.orgUnit)



    /**
     * Init respective form sections once stages are fetched
     */
    useEffect(() => {
        if (stages?.length > 0) {
            const patientObject = stages[0].sections.find(section => section.title.includes("Patients"))
            setPatientDetailsSection(patientObject)

            const questionObject = stages[0].sections.find(section => section.title.includes("Questions"))
            setQuestionSection(questionObject)

            const recommendationObject = stages[0].sections.find(section => section.title.includes("Recommendation"))
            setRecommendationSection(recommendationObject)

            const flagsObject = stages[0].sections.find(section => section.title.includes("Red"))
            setRedFlagsSection(flagsObject)

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
                    async: false
                }
            })
            if (response?.httpStatusCode == 200) {
                navigate(`/charts/submitted-form/${response.response?.id}`)
            }

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
            console.log("error", e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form onFinish={onFinish} form={form} layout="vertical" style={{position: "relative"}}>
            <CardItem title="AMS CHART REVIEW: NEW FORM">
                <div className={styles.parentContainer}>
                    <div className={styles.detailsContainer}>
                        <div className={styles.title}>PATIENT DETAILS</div>
                        <div className={styles.inputContainer}>
                            {/*............Patient IP/OP and ward section..................*/}
                            {patientDetailsSection?.dataElements?.map(dataElement => (
                                <Form.Item
                                    key={dataElement.id}
                                    label={dataElement.name}
                                    name={dataElement.id}
                                    rules={[
                                        {
                                            required: dataElement.required,
                                            message: `Please input ${dataElement.displayName}!`,
                                        },
                                        dataElement?.validator ? {validator: eval(dataElement.validator)} : null,
                                    ]}
                                >
                                    <InputItem
                                        type={dataElement.optionSet ? "SELECT" : dataElement.valueType}
                                        options={dataElement.optionSet?.options?.map((option) => ({
                                            label: option.name,
                                            value: option.code,
                                        }))}
                                        placeholder={`Enter ${dataElement.name}`}
                                        name={dataElement.id}
                                    />
                                </Form.Item>
                            ))}
                        </div>
                    </div>
                    {/*............Questions section section..................*/}
                    <div style={{marginTop: "6rem"}}>
                        <div className={styles.title}>QUESTIONS</div>

                        <ol className={styles.inputContainer}>
                            {questionSection?.dataElements?.map(dataElement => (
                                <li key={dataElement.id} style={{width: "100%"}}>
                                    <Form.Item
                                        key={dataElement.id}
                                        label={dataElement.name}
                                        name={dataElement.id}
                                        rules={[
                                            {
                                                required: dataElement.required,
                                                message: `Please input ${dataElement.displayName}!`,
                                            },
                                            dataElement?.validator ? {validator: eval(dataElement.validator)} : null,
                                        ]}
                                    >
                                        <InputItem
                                            type={dataElement.optionSet ? "SELECT" : dataElement.valueType}
                                            options={dataElement.optionSet?.options?.map((option) => ({
                                                label: option.name,
                                                value: option.code,
                                            }))}
                                            placeholder={`Enter ${dataElement.name}`}
                                            name={dataElement.id}
                                        />
                                    </Form.Item>
                                </li>
                            ))}
                        </ol>
                        {/*............Recommendation section..................*/}
                        <div className={styles.inputContainer}>
                            {recommendationSection?.dataElements?.map(dataElement => (
                                <Form.Item
                                    style={{color: "#1d5288 !important", width: "100%", gridColumn: "1/3"}}
                                    key={dataElement.id}
                                    label={dataElement.name}
                                    name={dataElement.id}
                                    rules={[
                                        {
                                            required: dataElement.required,
                                            message: `Please input ${dataElement.displayName}!`,
                                        },
                                        dataElement?.validator ? {validator: eval(dataElement.validator)} : null,
                                    ]}
                                >
                                    <InputItem
                                        type={dataElement.optionSet ? "SELECT" : dataElement.valueType}
                                        options={dataElement.optionSet?.options?.map((option) => ({
                                            label: option.name,
                                            value: option.code,
                                        }))}
                                        placeholder={`Enter ${dataElement.name}`}
                                        name={dataElement.id}
                                    />
                                </Form.Item>
                            ))}
                        </div>

                        {/*............Red flags section..................*/}
                        <div className={styles.inputContainer}>
                            {redFlagsSection?.dataElements?.map(dataElement => (
                                <Form.Item
                                    style={{color: "#1d5288 !important", width: "100%", gridColumn: "1/3"}}
                                    key={dataElement.id}
                                    label={dataElement.name}
                                    name={dataElement.id}
                                    rules={[
                                        {
                                            required: dataElement.required,
                                            message: `Please input ${dataElement.displayName}!`,
                                        },
                                        dataElement?.validator ? {validator: eval(dataElement.validator)} : null,
                                    ]}
                                >
                                    <InputItem
                                        type={dataElement.optionSet ? "SELECT" : dataElement.valueType}
                                        options={dataElement.optionSet?.options?.map((option) => ({
                                            label: option.name,
                                            value: option.code,
                                        }))}
                                        placeholder={`Enter ${dataElement.name}`}
                                        name={dataElement.id}
                                    />
                                </Form.Item>
                            ))}

                        </div>
                        <div className={styles.inputContainer} style={{gap: "2px", marginBottom: "10rem"}}>
                            <label htmlFor="comments">Additional Comments (if any):</label>
                            <Input.TextArea id="comments" placeholder="Additional Comments (if any)"
                                            style={{gridColumn: "1/3"}}/>
                        </div>
                    </div>

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