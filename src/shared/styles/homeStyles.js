import {createUseStyles} from "react-jss";

export const homeStyles = createUseStyles({
    container: {
        maxWidth: "80rem",
        margin: "0 auto",
    },
    header: {
        marginLeft: "3rem",
        color: "#012F6C",
        gridColumn: "1/4",
        "& h4": {
            fontWeight: "300",
            marginBottom: "2rem",
        },
        "& h1": {
            fontWeight: "500",
            fontSize: "1.5rem",
            lineHeight: "1.2",
        },
        "@media (max-width: 768px)": {
            gridColumn: "1/3",
        },
        "@media (max-width: 671px)": {
            gridColumn: "auto",
        },
    },
    links: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 20rem))",
        gap: "2rem",
        margin: "0 auto",
        justifyContent: "center",
        marginTop: "5rem",
    },
    linkItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0rem",
        borderRadius: "0.5rem",
        backgroundColor: "#fff",
        boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.1)",
        transition: "all 0.2s ease-in-out",
        margin: "0 3rem",
        cursor: "pointer",
        textDecoration: "none",
        minWidth: "10rem",
        "&:hover": {
            transform: "scale(1.05)",
        },
    },
    iconSection: {
        backgroundColor: "#EDF7FF",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
    },
    icon: {
        width: "3rem",
        height: "3rem",
        color: "#012F6C",
    },
    title: {
        padding: "1rem",
        textAlign: "center",
        color: "#012F6C",
    },
});