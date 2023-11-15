
const formatAttributeValues = (attributes) => {
    const attributeValues = attributes.map((attributeValue) => {
        return {
            name: attributeValue.attribute.name,
            value: attributeValue.value,
        };
    });
}

export const formatMembersForm = (program) => program?.programStages?.map((stage) => {
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


export const formatStages = (program)=> {
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