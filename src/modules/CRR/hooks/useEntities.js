import {useSelector} from "react-redux";

export const useEntities = () => {
    const crr = useSelector(state => state.crr)

    const getEntityByName = (searchString) => crr?.entities?.find(entity => entity.displayName.toLowerCase().includes(searchString.toLowerCase()))

    const getEntityByID = searchID => crr?.entities?.find(entity => entity.id === searchID)


    return {getEntityByID, getEntityByName}

}