import {useSelector} from "react-redux";


export const useAttributes = ()=>{
    const {attributes, optionSets} = useSelector(state => state.whonet)


    const getAttributeByID = (searchID) => {
        const attribute =  attributes.trackedEntityTypeAttributes.find(item => item?.trackedEntityAttribute?.id == searchID)
        return attribute?.trackedEntityAttribute
    }

    const getOptionSetByID = (searchID) =>{
        const optionObject = optionSets.find(optionSet=> optionSet.id === searchID)
        return optionObject
    }

    return {getAttributeByID, getOptionSetByID}



}
