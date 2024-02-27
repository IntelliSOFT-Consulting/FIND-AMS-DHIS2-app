import styles from "../styles/ChartDetails.module.css"
import {generateAlphaNumericList} from "../../../shared/helpers/numbering";

export const SectionDisplay = ({
                                   itemsContainerStyles,
                                   containerStyles,
                                   sectionForms,
                                   data,
                                   nameContainerStyles,
                                   valueContainerStyles,
                                   startingIndex,
                                   ordered = false,
                                   alphabet = false
                               }) => {


    const sectionValues = sectionForms?.dataElements?.map(element => {

        const item = {
            name: element?.name,
        }

        const elementObject = data?.find(dataObject => dataObject?.dataElement === element.id)

        if (element.optionSet) {
            const option = element.optionSet.options?.find(option => option.code === elementObject?.value)
            item['value'] = option?.displayName
        } else {
            item['value'] = elementObject?.value
        }

        return item

    })
    return (
        <div className={containerStyles}>
            {sectionValues?.map((item, index) => (
                <div className={itemsContainerStyles} key={index}>
                    <div className={nameContainerStyles}>
                        <p>
                            {ordered && !alphabet && <span className={styles.number}>
                                Question&nbsp;{startingIndex + index}.
                            </span>}
                            {ordered && alphabet && <span className={styles.number}>
                                Question&nbsp;{startingIndex}{generateAlphaNumericList(index)}.
                            </span>}

                            {item.name}</p>

                    </div>
                    <div className={valueContainerStyles}>{item.value}</div>
                </div>

            ))}
        </div>
    )
}