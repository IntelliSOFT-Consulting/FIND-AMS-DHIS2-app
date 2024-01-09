import {useSelector} from "react-redux";


export const useAttributes = ()=>{
    const {attributes} = useSelector(state => state.whonet)


    const getAttributeByID = (searchID) => {
        const attribute =  attributes.trackedEntityTypeAttributes.find(item => item.trackedEntityAttribute.id == searchID)
        return attribute.trackedEntityAttribute
    }

    return {getAttributeByID}

}