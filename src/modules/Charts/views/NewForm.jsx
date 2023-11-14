import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {Input, Select} from "antd";


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
        fontWeight: "500"
    },
    inputContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        "@media (min-width: 768px)": {
            gridTemplateColumns: "1fr 1fr"
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
        padding: ".1rem .5rem",
    },
    successButton: {
        color: "white",
        backgroundColor: "green",
        padding: ".3rem 2rem",
        borderRadius: "4px",
        outline: "none",
        border: "none",
        fontSize: "11px"
    },
    backButton: {
        color: "white",
        backgroundColor: "#1d5288",
        padding: ".3rem 2rem",
        borderRadius: "4px",
        outline: "none",
        border: "none",
        fontSize: "11px"
    },

})

export const NewForm = () => {
    const styles = useStyles()

    const CardFooter = () => {
        return (
            <div className={styles.actionContainer}>
                <button className={styles.backButton}>BACK</button>
                <button className={styles.successButton}>SUBMIT</button>
            </div>
        )
    }

    return (
        <CardItem title="AMS CHART REVIEW: NEW FORM" footer={CardFooter()}>
            <div className={styles.parentContainer}>

                <div className={styles.detailsContainer}>
                    <div className={styles.title}>PATIENT DETAILS</div>
                    <div className={styles.inputContainer}>
                        <div style={{padding: "1rem"}} className="form-control">
                            <label htmlFor="ip/op">IP/OP No. <span style={{color: "red"}}>&nbsp;*</span></label>
                            <Input
                                size="large"
                                id="ip/op"
                                placeholder="Search using IP/OP NO."
                                label="Filter by Date"
                            />
                        </div>
                        <div style={{padding: "1rem"}} className="form-control">
                            <label htmlFor="ward">Ward (specialty): <span style={{color: "red"}}>&nbsp;*</span></label>
                            <Select
                                id="ward"
                                defaultValue="Ward(specialty)"
                                required
                                size="large"
                            />
                        </div>
                    </div>

                </div>

                <form className={styles.formContainer}>
                    <p style={{height: "fit-content", width: "100%"}} className={styles.title}>QUESTIONS</p>

                </form>

            </div>
        </CardItem>
    )
}