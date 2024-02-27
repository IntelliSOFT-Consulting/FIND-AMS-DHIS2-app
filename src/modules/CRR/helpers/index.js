/**
 * Finds a section object by searching through the stages for a specific title
 * @param searchString
 * @param sectionArray
 * @returns {*}
 */
export const findSectionObject = ({searchString, sectionArray}) => {
    return sectionArray.find(section => section.title.toLowerCase().includes(searchString.toLowerCase()))
}