import {formatChartData} from "../../../shared/helpers/formatData";
import styles from "../styles/ChartDetails.module.css"

export const TextAreaDisplay = ({sectionForms, data}) => {

    const sectionValues = sectionForms?.dataElements?.map(element => ({
        name: element?.name || element?.displayName,
        value: formatChartData({
            dataElement: element.id,
            dataValues: data
        })
    }))

    return (
        <>
            {sectionValues?.map((item, index) => (
                <div className={styles.textAreaWrapper} key={index}>
                    <div className={styles.textAreaTitle}>{item.name}</div>
                    <div className={styles.textArea}>{item.value}</div>
                </div>
            ))}
        </>

    )
}