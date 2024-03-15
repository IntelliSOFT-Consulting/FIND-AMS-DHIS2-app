/**
 * Finds a section object by searching through the stages for a specific title
 * @param searchString
 * @param sectionArray
 * @returns {*}
 */
export const findSectionObject = ({searchString, sectionArray}) => {
    return sectionArray.find(section => section.title.toLowerCase().includes(searchString.toLowerCase()))
}


const formatAttributeValues = attributes => {
    return attributes.reduce((acc, attributeValue) => {
        const key = attributeValue?.attribute?.name?.toLowerCase();
        if (key) acc[key] = attributeValue.value
        return acc;
    }, {})
}

export const formatRegistration = (program) => {
    return {
        title: "Patient details",
        enrollment: true,
        sections: program?.programSections?.map(section => ({
            title: section.name,
            description: section.description,
            sectionId: section.id,
            dataElements: section?.trackedEntityAttributes?.map(attribute => ({
                name: attribute.name,
                id: attribute.id,
                valueType: attribute.valueType,
                optionSet: attribute.optionSet,
                ...formatAttributeValues(attribute.attributeValues)
            }))
        }))
    }
}