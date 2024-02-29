import styles from "../styles/ChartDetails.module.css"

export const MultiSelectSectionDisplay = ({sectionForms, data, number}) => {

    const selectedOptionsArray = data?.map(item => ({
        name: item.dataValues[0].value,
        dataElement: item.dataValues[0].dataElement
    })).filter(item =>  item.dataElement === sectionForms?.dataElements[0].id)


    return (
        <div className={styles.multiSelectWrapper}>
            <p className={styles.multiSelectTitle}>Question&nbsp;{number}.&nbsp;{sectionForms.title}</p>
            {
                selectedOptionsArray?.map((item, index)=> (
                    <div key={item.name} className={styles.multiSelectItem}>{item.name}</div>
                ))
            }
        </div>
    )
}