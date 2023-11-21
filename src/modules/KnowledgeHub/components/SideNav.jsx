import styles from "../styles/SideNav.module.css"
import {FolderAddOutlined, FolderOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

export const SideNav = ({callbackHandler, options}) => {
    const navigate = useNavigate()

    return (
        <div className={styles.sideNavContainer}>
            <div className={styles.title}>Categories.</div>
            <div
                onClick={() => navigate("/knowledge-hub/new-file")}
                className={styles.addNewNavItem}>
                <p>Add New</p>
                <FolderAddOutlined className={styles.navIcon}/>
            </div>
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