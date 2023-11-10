import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
    header: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2C6693",
        color: "white",
        margin: 0,
        padding: "4px 1.5rem",
        marginBottom: "20px",
        fontSize: "14px",
        width: "100%",
    },
    card: {
        height: "fit-content !important",
        width: "100%",
        overflow: "auto",
        border: "0.5px solid #D3D3D3",
        boxShadow: "4px 4px 4px #D3D3D3",
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
    },
    cardTitle: {
        backgroundColor: "#2C6693",
        color: "white",
        margin: "0px",
        padding: "1rem 1.5rem",
        marginBottom: "20px",
        fontSize: "14px",
    },
    cardBody: {
        padding: "20px",
        width: "100%"
    },
    footer: {
        padding: "10px 1.5rem",
        backgroundColor: "#E3EEF7"
    },
})


export const CardItem = ({title, footer, children}) => {
    const styles = useStyles()
    return (
        <div className={styles.card}>
            {typeof title === "string" ? (
                <h5 className={styles.cardTitle}>{title}</h5>
            ) : (
                <div className={styles.header}>{title}</div>
            )}
            <div className={styles.cardBody}>{children}</div>
            {footer && (<div className={styles.footer}>{footer}</div>)}
        </div>
    )
}