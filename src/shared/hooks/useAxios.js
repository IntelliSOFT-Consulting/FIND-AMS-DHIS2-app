import {useState} from "react"
import axios from "axios";

export const useAxios = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const axiosInstance = axios.create({
        baseURL: "https://jsonplaceholder.typicode.com/",
    })

    const makeRequest = async (config) => {
        setLoading(true)
        setError(null)

        try {
            const response = await axiosInstance(config)
            setData(response.data)
        } catch (e) {
            setError(e)
        } finally {
            setLoading(false)
        }
    }

    return {data, loading, error, makeRequest}

}