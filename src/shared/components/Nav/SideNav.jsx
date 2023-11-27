import styles from "../../styles/SideNav.module.css";

export const SideNav = ({ options, title}) => {
    return (
        <div className={styles.sideNavContainer}>
            <div className={styles.title}>{title}.</div>
            {
                options?.map((category, index) => (
                    <div
                        onClick={category.handler}
                        className={styles.sideNavItem}
                        key={index}>
                        <category.icon className={styles.navIcon}/>
                        <p>{category.displayName}</p>
                    </div>
                ))
            }
        </div>
    )
}