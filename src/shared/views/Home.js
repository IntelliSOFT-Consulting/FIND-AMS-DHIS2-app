import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setUser} from "../redux/actions";
import {homeLinks} from "../assets/navLinks";
import {usePermissions} from "../hooks/usePermissions";
import {homeStyles} from "../styles/homeStyles";


const LinkWrapper = ({external, path, children}) => {
    const classes = homeStyles()
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
    const classes = homeStyles();
    const dispatch = useDispatch();

    const {exportAllowedLinks, allowedLinks} = usePermissions()

    useEffect(() => {
        if(user){
            dispatch(setUser(user))
            exportAllowedLinks({links: homeLinks, user})
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
