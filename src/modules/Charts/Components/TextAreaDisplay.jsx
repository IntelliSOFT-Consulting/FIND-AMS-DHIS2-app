import styles from "../styles/ChartDetails.module.css"

export const TextAreaDisplay = ({sectionForms, data}) => {


    const sectionValues = sectionForms?.dataElements?.map(dataElement => {

        let item = {
            name: dataElement.name,
        }

        const dataObject = data?.find(item => item.dataElement === dataElement.id)

        const value = dataElement.valueType === "DATE" ? new Date(dataObject?.value)?.toLocaleDateString() : dataObject?.value

        item['value'] = value

        return item

    })

    return (
        <>
            {sectionValues?.map((item, index) => (
                <div className={styles.textAreaWrapper} key={index}>
                    <div className={styles.textAreaTitle}>{item.name}</div>
                    <div
                        className={styles.textArea}>{ item.value}</div>
                </div>
            ))}
        </>

    )
}