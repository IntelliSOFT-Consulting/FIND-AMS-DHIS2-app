import {formatChartData} from "../../../shared/helpers/formatData";

export const SectionDisplay = ({
                                   itemsContainerStyles,
                                   containerStyles,
                                   sectionForms,
                                   data,
                                   nameContainerStyles,
                                   valueContainerStyles
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
                    <div className={nameContainerStyles}>{item.name}</div>
                    <div className={valueContainerStyles}>{item.value}</div>
                </div>

            ))}
        </div>
    )
}