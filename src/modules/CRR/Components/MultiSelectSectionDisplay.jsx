import styles from "../styles/ChartDetails.module.css"

export const MultiSelectSectionDisplay = ({sectionForms, data, number}) => {

    const selectedOptionsArray = data?.map(item => ({
        name: item.dataValues[0]?.value,
        dataElement: item.dataValues[0]?.dataElement
    }))?.filter(item => item?.dataElement === sectionForms?.dataElements.find(de => de.optionSet)?.id)



    const otherOption = sectionForms?.dataElements?.find(de => de?.valueType === "LONG_TEXT")
    // console.log("section forms", sectionForms)
    // console.log("data", data)
    console.log("Other DE", otherOption)

    const otherValue = (data?.find(item => item?.dataValues[0]?.dataElement ==otherOption?.id))?.dataValues[0]?.value
    console.log("value", otherValue)

    // const otherValue = data?.map(item => {
    //     name
    // })
    // console.log("otherOption", otherOption)
    // console.log("data", data)
    return (
        <div className={styles.multiSelectWrapper}>
            <p className={styles.multiSelectTitle}>Question&nbsp;{number}.&nbsp;{sectionForms.title}</p>
            {
                selectedOptionsArray?.map((item, index) => (
                    <div key={item.name} className={styles.multiSelectItem}>{item.name}</div>
                ))
            }
            {
                otherValue && (
                    <div className={styles.multiSelectItemOtherWrapper} >
                        <div className={styles.multiSelectItemOtherTitle}>{otherOption.name}</div>
                        <div
                            className={styles.textArea}>{otherValue}</div>
                    </div>
    )
}
</div>
)
}