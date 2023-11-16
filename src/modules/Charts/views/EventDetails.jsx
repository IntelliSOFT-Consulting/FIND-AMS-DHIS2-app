import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {useEffect, useState} from "react";
import {useDataQuery} from "@dhis2/app-runtime";
import {formatChartData} from "../../../shared/helpers/formatData";
import {useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";


const useStyles = createUseStyles({
    parentContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "4rem",
        position: "relative"
    },
    header: {
        backgroundColor: "rgb(234, 238, 240)",
        color: "#1d5288",
        padding: ".5rem 1rem",
        fontWeight: "500"
    },
    headerContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        padding: ".5rem 1rem",
        marginTop: "2rem",
        gap: "1rem",
        "@media (min-width: 768px)": {
            padding: "1rem 3rem",
            gridTemplateColumns: "1fr 1fr",
            gap: "6rem"
        }
    },
    headerComponent: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        border: "1px solid",

    },
    headerItem: {
        borderRight: ".5px solid",
        padding: ".5rem .5rem",
    },
    sectionWrapper: {
        width: "100%",
        padding: "1rem 3rem",
    },
    questionBox: {
        display: "grid",
        gridTemplateColumns: "4fr 1fr",
        borderBottom: "1px solid",
        gap: "1rem",
        alignItems: "center",
        "@media (min-width: 768px)": {
            gap: "2rem"
        }
    },
    questionItem: {
        padding: "1rem"
    }
})


const query = {
    events: {
        resource: ``,
    }
}


export const EventDetails = () => {
    const [patientDetailsSection, setPatientDetailsSection] = useState({})
    const [questionSection, setQuestionSection] = useState({})
    const [recommendationSection, setRecommendationSection] = useState({})
    const [redFlagsSection, setRedFlagsSection] = useState({})


    const styles = useStyles()
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


    return (
        <CardItem title={`AMS CHART REVIEW: FORM ${data?.events?.event}`}>
            <div className={styles.header}>PATIENT DETAILS</div>

            <div className={styles.parentContainer}>

                {/*....patient section*/}
                <div className={styles.headerContainer}>
                    <div className={styles.headerComponent}>
                        <div className={styles.headerItem}>IP/OP NO. :</div>
                        <div className={styles.headerItem}>
                            {formatChartData({
                                dataElement: "qm3sLorGhAm",
                                dataValues: data?.events?.dataValues
                            })}
                        </div>
                    </div>
                    <div className={styles.headerComponent}>
                        <div className={styles.headerItem}>Ward(specialty) :</div>
                        <div className={styles.headerItem}>
                            {formatChartData({
                                dataElement: "u4UlC8FpDCV",
                                dataValues: data?.events?.dataValues
                            })}
                        </div>
                    </div>
                </div>

                {/*Question section.......................................*/}
                <div className={styles.sectionWrapper}>
                    <div style={{width: "100%", border: "1px solid"}}>
                        {questionSection?.dataElements?.map((dataElement, index) => (
                            <div key={dataElement?.id} className={styles.questionBox}>
                                <div className={styles.questionItem}
                                     style={{borderRight: "1px solid"}}>
                                    <span style={{fontWeight: 700}}>{`Question ${index + 1}:`}</span>
                                    &nbsp;&nbsp;{dataElement?.name}
                                </div>
                                <div className={styles.questionItem}>
                                    {formatChartData({
                                        dataElement: dataElement?.id,
                                        dataValues: data?.events?.dataValues
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/*Recommendation section.......................................*/}
                <div className={styles.sectionWrapper}>
                    <div style={{width: "100%", border: "1px solid"}}>
                        {recommendationSection?.dataElements?.map((dataElement, index) => (
                            <div key={dataElement?.id} className={styles.questionBox}>
                                <div className={styles.questionItem}
                                     style={{borderRight: "1px solid"}}>
                                <span
                                    style={{fontWeight: 700}}>{`Question ${questionSection?.dataElements.length + index + 1}:`}</span>
                                    &nbsp;&nbsp;{dataElement?.name}
                                </div>
                                <div className={styles.questionItem}>
                                    {formatChartData({
                                        dataElement: dataElement?.id,
                                        dataValues: data?.events?.dataValues
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/*Red Flags section.......................................*/}

                <div className={styles.sectionWrapper}>
                    <div style={{width: "100%", border: "1px solid"}}>
                        {redFlagsSection?.dataElements?.map((dataElement, index) => (
                            <div key={dataElement?.id} className={styles.questionBox}>
                                <div className={styles.questionItem}
                                     style={{borderRight: "1px solid"}}>
                                <span
                                    style={{fontWeight: 700}}>{`Question ${recommendationSection?.dataElements.length + questionSection?.dataElements.length + index + 1}:`}</span>
                                    &nbsp;&nbsp;{dataElement?.name}
                                </div>
                                <div className={styles.questionItem}>
                                    {formatChartData({
                                        dataElement: dataElement?.id,
                                        dataValues: data?.events?.dataValues
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </CardItem>
    )
}