const formatAttributeValues = (attributes) => {
    const attributeValues = attributes.map((attributeValue) => {
        return {
            name: attributeValue.attribute.name,
            value: attributeValue.value,
        };
    });
}


export const formatStages = (program) => {
    return program?.programStages?.map((stage) => {
        return {
            title: stage.name,
            enrollment: false,
            id: stage.id,
            repeatable: stage.repeatable,
            ...formatAttributeValues(stage.attributeValues),
            sections: stage.programStageSections.map((section) => {
                return {
                    title: section.displayName,
                    sectionId: section.id,
                    repeating: section.description === "repeating",
                    dataElements: section.dataElements.map((dataElement) => {
                        return {
                            name: dataElement.displayName,
                            id: dataElement.id,
                            valueType: dataElement.valueType,
                            compulsory: dataElement.compulsory,
                            optionSet: dataElement.optionSet,
                            ...formatAttributeValues(dataElement.attributeValues),
                        };
                    }),
                };
            }),
        };
    });
}


export const formatChartData = ({dataElement, dataValues}) => {
    const object = dataValues?.find(item => item?.dataElement === dataElement)
    return object?.value
}

export const getArrayOfDataElements = (programSections) => {
    let dataElements = []

    for (let i =0; i < programSections.length; i++) {
        for(let j=0; j < programSections[i].programStageSections?.length; j++){
            for (let k =0; k < programSections[i].programStageSections[j].dataElements?.length; k++ ){
                dataElements.push(programSections[i].programStageSections[j].dataElements[k])
            }
        }
    }

    return dataElements
}



