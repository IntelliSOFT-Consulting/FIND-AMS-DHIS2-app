import styles from "../../styles/SideNav.module.css";
import {FolderOutlined} from "@ant-design/icons";

export const SideNav = ({ options}) => {
    return (
        <div className={styles.sideNavContainer}>
            <div className={styles.title}>Wards.</div>
            {
                options?.map((category, index) => (
                    <div
                        onClick={category.handler}
                        className={styles.sideNavItem}
                        key={index}>
                        <FolderOutlined className={styles.navIcon}/>
                        <p>{category.displayName}</p>
                    </div>
                ))
            }
        </div>
    )
}