import {formatChartData} from "../../../shared/helpers/formatData";
import styles from "../styles/ChartDetails.module.css"

export const MultiSelectSectionDisplay = ({sectionForms, data}) => {

    const sectionValues = sectionForms?.dataElements?.filter(element => formatChartData({
            dataElement: element.id,
            dataValues: data
        }) !== undefined
    )


    return (
        <div className={styles.multiSelectWrapper}>
            <p className={styles.multiSelectTitle}>{sectionForms.title}</p>
            {
                sectionValues?.map(item => (
                    <div key={item.id} className={styles.multiSelectItem}>{item.name}</div>
                ))
            }
        </div>
    )
}