import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {useDataElements} from "./useDataElements";

const query = {
    logs: {
        resource: "dataStore/tracker-capture/keyDefaultLayoutLocked",
    }
}

export const useListing = () => {
    const [searchString, setSearchString] = useState("")



    const [records, setRecords] = useState([])

    const {program} = useSelector(state => state.microbiology)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const navigate = useNavigate()


    const {getDataElementByName} = useDataElements()


    const {data, refetch, loading} = useDataQuery(query)


    const handleSearch = async () => {
        await refetch({
            filter: `${getDataElementByName("Rename").id}:ILIKE:${searchString}`
        })
    }

    const handleChange = async (evt) => {
        setSearchString(evt.target.value)

        if (evt.target.value === "")
            await refetch({filter: ""})
    }


    useEffect(() => {

        if (data?.logs?.length > 0) {
            let processedData = data.logs.map((log, index) => ({
                ...log,
                batchNo: log?.batchNo === null ? `null-${index}` : log?.batchNo
            }))
            processedData = processedData.filter(log => log.status)
            setRecords(processedData)
        }

        return () => {
            setRecords([])
        }

    }, [data]);

    useEffect(() => {

        if (orgUnitID && program)
            refetch({program, orgUnitID})

    }, [orgUnitID, program]);

    return {
        searchString,
        handleSearch,
        loading,
        records,
        handleChange,
        navigate
    }
}