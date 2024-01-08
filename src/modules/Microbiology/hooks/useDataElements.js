import {useSelector} from "react-redux";


export const useDataElements = () => {

    const {dataElements} = useSelector(state => state.microbiology)


    const getDataElementByName = (searchString) => {
        return dataElements?.find(dataElement => dataElement.displayName.toLowerCase().includes(searchString.toLowerCase()))
    }

    const getDataElementByID = (searchID) => {
        return dataElements?.find(dataElement => dataElement.id === searchID)
    }


    return {getDataElementByName, getDataElementByID}
}