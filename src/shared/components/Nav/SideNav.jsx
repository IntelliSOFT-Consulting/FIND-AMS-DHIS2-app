import styles from "../../styles/SideNav.module.css";
import {useState} from "react";

export const SideNav = ({options, title}) => {
    const [activeIndex, setActiveIndex] = useState("")


    return (
        <div className={styles.sideNavContainer}>
            <div className={styles.title}>{title}.</div>
            {
                options?.map((category, index) => (
                    <div
                        onClick={() => {
                            category.handler()
                            setActiveIndex(index)
                        }}
                        className={activeIndex === index ? styles.activeSideNavItem : styles.sideNavItem}
                        key={index}>
                        <category.icon className={styles.navIcon}/>
                        <p>{category.displayName}</p>
                        <div className={styles.action}>{category.action}</div>
                    </div>
                ))
            }
        </div>
    )
}