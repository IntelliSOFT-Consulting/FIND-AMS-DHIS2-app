import styles from "../../KnowledgeHub/styles/SideNav.module.css"
import { FolderOutlined} from "@ant-design/icons";

export const WardsNav = ({callbackHandler, options, }) => {

    return (
        <div className={styles.sideNavContainer}>
            <div className={styles.title}>Wards.</div>


            {
                options?.map((category, index) => (
                    <div
                        onClick={() => callbackHandler(category.code)}
                        className={styles.sideNavItem}
                        key={index}>
                        <FolderOutlined className={styles.navIcon}/>
                        <p>{category.displayName}</p>
                    </div>
                ))
            }
            <div
                onClick={() => callbackHandler("")}
                className={styles.sideNavItem}>
                <FolderOutlined className={styles.navIcon}/>
                <p>All Files</p>
            </div>
        </div>
    )
}