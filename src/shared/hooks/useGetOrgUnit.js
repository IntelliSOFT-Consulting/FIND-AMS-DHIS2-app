import {useDataEngine} from "@dhis2/app-runtime";
import {useDispatch} from "react-redux";
import {setOrgUnit} from "../redux/actions";


export const useGetOrgUnit = () => {
    const engine = useDataEngine()
    const dispatch = useDispatch()

    const getOrgUnit = async () => {
        try {
            const {organisationUnits} = await engine.query({
                organisationUnits: {
                    resource: "organisationUnits",
                    params: {
                        fields: ["id", "name"],
                        filter: "name:ilike:makueni"
                    }
                }
            })
            dispatch(
                setOrgUnit(organisationUnits?.organisationUnits[0])
            )
        } catch (e) {
            console.log('error', e)
        }
    }

    return {getOrgUnit}
}