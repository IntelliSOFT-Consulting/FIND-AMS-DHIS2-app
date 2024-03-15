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