import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {CardItem} from "../../../shared/components/cards/CardItem";
import {Spin} from "antd";
import {formatChartData} from "../../../shared/helpers/formatData";
import {createUseStyles} from "react-jss";



const useStyles = createUseStyles({
    parentContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
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
        console.log('stages', stages)
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

    console.log('ques', questionSection)


    return (
        <CardItem title="AMS CHART REVIEW: FORM XYZZY">
            <div className={styles.header}>PATIENT DETAILS</div>
            {loading ? <Spin/> : (
                <div className={styles.parentContainer}>

                    <div className={styles.headerContainer}>
                        <div className={styles.headerComponent}>
                            <div className={styles.headerItem}>IP/OP No. :</div>
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


                    <div className={}>
                        {questionSection?.dataElements?.map(dataElement =>(
                            <div key={dataElement.id}>Me</div>
                        ))}
                    </div>

                </div>

            )}

        </CardItem>
    )
}