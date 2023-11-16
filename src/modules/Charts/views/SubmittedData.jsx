import {CardItem} from "../../../shared/components/cards/CardItem";
import {useNavigate} from "react-router-dom";
import {createUseStyles} from "react-jss";
import {useDataQuery} from "@dhis2/app-runtime";


const useStyles = createUseStyles({
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
        resource: `tracker/events/dMPjYXF0wAb`,
        params: {
            fields: ["trackedEntityInstance", "trackedEntityType", "attributes[attribute,value]", "enrollments[*]"],
            order: "created:desc",
            ouMode: "ALL",
            program: "KqmTbzBTDVj",
            pageSize: 500
        }
    }
}


export const SubmittedData = () => {
    const styles = useStyles()
    const navigate = useNavigate()

    const {loading, data, refetch, error} = useDataQuery(query)


    return (
        <CardItem title="AMS CHART REVIEW: FORM XYZZY">
            <div className={styles.header}>PATIENT DETAILS</div>
            <div className={styles.headerContainer}>
                <div className={styles.headerComponent}>
                    <div className={styles.headerItem}>IP/OP No. :</div>
                    <div className={styles.headerItem}>123456789</div>
                </div>
                <div className={styles.headerComponent}>
                    <div className={styles.headerItem}>Ward(specialty) :</div>
                    <div className={styles.headerItem}>Female Ward</div>
                </div>


            </div>
        </CardItem>
    )
}