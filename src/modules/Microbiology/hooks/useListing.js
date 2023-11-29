import {useState} from "react";

export const useListing = () => {
    const [searchString, setSearchString] = useState("")

    const [loading, setLoading] = useState(false)

    const tableColumns = [
        {

        }
    ]

    const handleSearch = (evt) => {

    }

    const getMicrobiologyData = async () => {
        try {

        } catch (e) {

        } finally {
            setLoading(false)
        }
    }

    return {
        searchString,
        setSearchString,
        handleSearch
    }
}