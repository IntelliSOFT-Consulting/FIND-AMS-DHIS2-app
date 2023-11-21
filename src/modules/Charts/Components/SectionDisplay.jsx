import {formatChartData} from "../../../shared/helpers/formatData";
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
    const sectionValues = sectionForms?.dataElements?.map(element => ({
        name: element?.name || element?.displayName,
        value: formatChartData({
            dataElement: element.id,
            dataValues: data
        })
    }))
    return (
        <div className={containerStyles}>
            {sectionValues?.map((item, index) => (
                <div className={itemsContainerStyles} key={index}>
                    <div className={nameContainerStyles}>
                        <p>
                            {ordered && !alphabet &&  <span className={styles.number}>
                                Question&nbsp;{startingIndex + index}.
                            </span>}
                            {ordered && alphabet &&  <span className={styles.number}>
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