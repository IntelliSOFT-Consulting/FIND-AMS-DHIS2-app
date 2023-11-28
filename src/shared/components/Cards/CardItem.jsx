import styles from "../../styles/CardItem.module.css"

export const CardItem = ({title, footer, CardHeader, children}) => {

    return (
        <div className={styles.card}>
            <div className={styles.cardTitle}>
                {title}
                {CardHeader &&  <CardHeader className={styles.header}/>}
            </div>
            <div className={styles.cardBody}>{children}</div>
            {footer && (<div className={styles.footer}>{footer}</div>)}
        </div>
    )
}