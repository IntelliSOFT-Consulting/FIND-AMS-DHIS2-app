import {useDataEngine} from "@dhis2/app-runtime";


export const useOptions = () => {
    const engine = useDataEngine()

    const getOptionSetByID = async (id) => {
        try {
            const {data: {options}} = await engine.query({
                data: {
                    resource: `optionSets/${id}`,
                    params: {
                        fields: [
                            "all",
                            "attributeValues[all,attribute[id,name, displayName]]",
                            "options[id, name, displayName, code]"
                        ]
                    }
                }
            })

            return options
        } catch (e) {
            return e
        }
    }

    return {getOptionSetByID}
}