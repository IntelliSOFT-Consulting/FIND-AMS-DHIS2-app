import {useDataEngine} from "@dhis2/app-runtime";
import {useDispatch} from "react-redux";
import {notification} from "antd";
import {setUser} from "../redux/actions";


export const useUser = () => {
    const engine = useDataEngine()
    const dispatch = useDispatch()


    const getUser = async () => {
        try {
            const response = await engine.query({
                me: {
                    resource: 'me',
                    params: {
                        fields: [
                            "all","organisationUnits[id]","userGroups[id]","userCredentials[:all,!user,userRoles[id]",
                        ]
                    }
                },
            })
            dispatch(
                setUser(response.me)
            )
        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        }
    }

    return {getUser}

}