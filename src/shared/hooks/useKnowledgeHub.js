import {useDataEngine} from "@dhis2/app-runtime";
import {useDispatch} from "react-redux";
import {setKnowledgeHub} from "../redux/actions";
import {formatStages} from "../helpers/formatData";
import {notification} from "antd";


export const useKnowledgeHub = () => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const getKnowledgeHubDataElements = ({sections}) => sections.flatMap(section => section.dataElements)


    const getKnowledgeForm = async () => {
        try {
            const {programs} = await engine.query({
                programs: {
                    resource: "programs",
                    params: {
                        fields: [
                            "id",
                            "name",
                            "trackedEntityType",
                            "programStages[id,name,repeatable,attributeValues[attribute[id,name],value],programStageSections[id,displayName,description,dataElements[id,displayName,description,attributeValues[attribute[id,name],value],valueType,optionSet[id,displayName,options[id,displayName,code]]]]]",
                            "programSections[name,trackedEntityAttributes[id,name,searchable,description,attributeValues[attribute[id,name],value],valueType,optionSet[options[displayName, code]]]",
                        ],
                        filter: "name:ilike:Knowledge",
                    }
                }
            })
            const program = programs?.programs[0];

            const stages = formatStages(program)

            dispatch(
                setKnowledgeHub({
                    program: program?.id,
                    stages,
                    trackedEntityType: program?.trackedEntityType,
                    dataElements: getKnowledgeHubDataElements({sections: program?.programStages[0]?.programStageSections})
                })
            )

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        }
    }


    return {getKnowledgeForm}

}