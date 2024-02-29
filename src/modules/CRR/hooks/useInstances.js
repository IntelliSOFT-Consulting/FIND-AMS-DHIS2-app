import {useDataEngine} from "@dhis2/app-runtime";
import {notification} from "antd";


export const useInstances = () => {
    const engine = useDataEngine()

    const getEnrollmentData = async (tei= null, isNew = false) => {
        try{
            const {events} = await engine.query({
                events: {
                    resource: `trackedEntityInstances/${tei}`,
                    params: {
                        fields: "enrollments[*]"
                    }
                }
            })
            if(isNew) return events?.enrollments[0];
        }catch (e){
            notification.error({
                message: "Failed to get enrollment data"
            })
        }
    }

    return {getEnrollmentData}
}