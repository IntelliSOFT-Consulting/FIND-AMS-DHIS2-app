import {useDataEngine} from "@dhis2/app-runtime";
import {useDispatch} from "react-redux";
import {setForms} from "../redux/actions";
import { formatStages} from "../helpers/formatData";
import {notification} from "antd";


export const useGetForms = () => {
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
                            "programStages[id,name,repeatable,attributeValues[attribute[id,name],value],programStageSections[id,displayName,description,dataElements[id,displayName,description,attributeValues[attribute[id,name],value],valueType,optionSet[id,displayName,options[id,displayName,code]]]]]",
                            "programSections[name,trackedEntityAttributes[id,name,searchable,description,attributeValues[attribute[id,name],value],valueType,optionSet[options[displayName, code]]]",
                        ],
                        filter: "name:ilike:chart",
                    }
                }
            })
            const program = programs?.programs[0];


            const stages = formatStages(program)

            dispatch(
                setForms({
                    program: program?.id,
                    stages,
                    trackedEntityType: program?.trackedEntityType
                })
            )

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
            console.log('error', e)
        }
    }


    return {getForms}

}