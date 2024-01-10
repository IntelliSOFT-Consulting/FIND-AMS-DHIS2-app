import {useDataEngine} from "@dhis2/app-runtime";
import {useDispatch} from "react-redux";
import {formatStages, getArrayOfDataElements} from "../../../shared/helpers/formatData";
import {setMicrobiology, setWHONET} from "../../../shared/redux/actions";
import {notification} from "antd";

export const useMicrobiology = () => {
    const engine = useDataEngine()

    const dispatch = useDispatch()

    const getMicrobiologyData = async () => {
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
                        filter: "name:ilike:Microbiology",
                    }
                }
            })

            const program = programs?.programs[0]

            const sections = formatStages(program)

            dispatch(
                setMicrobiology({
                    program: program.id,
                    formSections: sections[0],
                    trackedEntityType: program.trackedEntityType,
                    dataElements: getArrayOfDataElements(program?.programStages[0]?.programStageSections)
                })
            )

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        }
    }


    const getWHONETData = async () => {
        try {
            const {programs} = await engine.query({
                programs: {
                    resource: "trackedEntityTypes",
                    params: {
                        fields: [
                            "id", "displayName", "name", "trackedEntityTypeAttributes[trackedEntityAttribute[id,displayName]]"
                        ],
                    }
                }
            })


            dispatch(
                setWHONET({
                    attributes: programs.trackedEntityTypes[0]
                })
            )

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        }
    }


    const getOptionSets = async () => {
        try {
            const {programs} = await engine.query({
                programs: {
                    resource: "optionSets",
                    params: {
                        fields: [
                            "displayName",
                            "shortName",
                            "id",
                            "lastUpdated",
                            "created",
                            "displayDescription",
                            "code",
                            "publicAccess",
                            "access",
                            "href",
                            "level",
                            "displayName",
                            "valueType",
                            "publicAccess"
                        ],
                        filter: "name:ne:default",
                        order: "displayName:ASC"
                    }
                }
            })

            dispatch(
                setWHONET({
                    optionSets: programs.optionSets
                })
            )

        } catch(e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        }
    }


    return {getMicrobiologyData, getWHONETData, getOptionSets}

}