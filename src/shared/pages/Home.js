import React, {useEffect} from "react";
import {createUseStyles} from "react-jss";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setUser} from "../redux/actions";
import {navLinks} from "../assets/navLinks";
import {usePermissions} from "../hooks/usePermissions";

const styles = createUseStyles({
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

const LinkWrapper = ({external, path, children}) => {
    const classes = styles()
    return (
        <>
            {
                external ? (
                    <a href={path} className={classes.linkItem}>
                        {children}
                    </a>
                ) : (
                    <Link to={path} className={classes.linkItem}>
                        {children}
                    </Link>
                )
            }
        </>
    )
}

export default function Home({user}) {
    const classes = styles();
    const dispatch = useDispatch();

    const {exportAllowedLinks, allowedLinks} = usePermissions()

    useEffect(() => {
        if(user){
            dispatch(setUser(user))
            exportAllowedLinks({links: navLinks, user})
        }
    }, [user]);

    return (
        <div className={classes.container}>
            <div className={classes.links}>
                {allowedLinks.map((link) => (
                    <LinkWrapper key={link.title} external={link.external} path={link.path}>
                        <div className={classes.iconSection}>
                            <link.icon className={classes.icon} aria-hidden="true"/>
                        </div>
                        <div className={classes.title}>
                            <span>{link.title}</span>
                        </div>
                    </LinkWrapper>
                ))}
            </div>
        </div>
    );
}
