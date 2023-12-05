import styles from "../../styles/CardItem.module.css"
import {Breadcrumb} from "antd";
import {DoubleLeftOutlined} from "@ant-design/icons";

export const CardItem = ({title, footer, CardHeader, children, linkItems}) => {

    return (
        <>
            {linkItems && (
                <Breadcrumb
                    className={styles.breadCrumb}
                    separator={<DoubleLeftOutlined/>}
                    style={{marginBottom: "1rem"}}
                    items={linkItems}
                />
            )}

            <div className={styles.card}>

                <div className={styles.cardTitle}>
                    {title}
                    {CardHeader && <CardHeader className={styles.header}/>}
                </div>
                <div className={styles.cardBody}>{children}</div>
                {footer && (<div className={styles.footer}>{footer}</div>)}
            </div>
        </>

    )
}