import {useDataEngine} from "@dhis2/app-runtime";
import {useDispatch} from "react-redux";
import {formatRegistration} from "../helpers";
import {setCRR, setForms} from "../../../shared/redux/actions";
import {notification} from "antd";
import {formatStages, getArrayOfDataElements} from "../../../shared/helpers/formatData";


export const useCRR = () => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const getForms = async () => {
        try {

            const {programs} = await engine.query({
                programs: {
                    resource: "programs",
                    params: {
                        fields: [
                            "id",
                            "name",
                            "trackedEntityType",
                            "programStages[id,name,repeatable,attributeValues[attribute[id,name],value],programStageSections[id,displayName,description,dataElements[id,displayName,description,attributeValues[attribute[id,name],value],valueType,optionSet[id,displayName,options[id,displayName,code,attributeValues[attribute[id,name],value]]]]]]",
                            "programSections[name,trackedEntityAttributes[id,name,searchable,description,attributeValues[attribute[id,name],value],valueType,optionSet[options[displayName, code,attributeValues[attribute[id,name],value]]]]",
                        ],
                        filter: "name:ilike:crr",
                    }
                },
            });

            const program = programs?.programs[0]

            const registration = formatRegistration(program)

            const stages = formatStages(program)
            dispatch(
                setForms({
                    program: program?.id,
                    stages,
                    trackedEntityType: program?.trackedEntityType,
                    dataElements: getArrayOfDataElements(program?.programStages)
                })
            )

            dispatch(
                setCRR({
                    registration,
                    program: program?.id,
                    stages,
                    trackedEntityType: program?.trackedEntityType,
                })
            )

        } catch (e) {
            notification.error({
                message: "Error",
                description: "Couldn't fetch chart review data",
            });
        }
    }


    const getCRRTrackedEntities = async () => {
        try {
            const {trackedEntityAttributes} = await engine.query({
                trackedEntityAttributes: {
                    resource: "trackedEntityAttributes",
                    params: {
                        fields: [
                            "id",
                            "displayName",
                            "valueType",
                            "unique",
                            "optionSet",
                            "mandatory",
                            "attributeValues[attribute[id, name], value]"
                        ],
                    }
                }
            })
            dispatch(
                setCRR({
                    entities: trackedEntityAttributes?.trackedEntityAttributes
                })
            )
        } catch (e) {
            notification.error({
                message: "Error",
                description: "Couldn't get tracked entities",
            });
        }
    }



    return {getForms, getCRRTrackedEntities}
}