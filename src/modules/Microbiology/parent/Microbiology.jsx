import {Route, Routes} from "react-router-dom";
import {microbiologyRoutes} from "../routes";
import {useMicrobiology} from "../hooks/useMicrobiology";
import {useEffect} from "react";

export const Microbiology = () => {
    const {getMicrobiologyData, getWHONETData} = useMicrobiology()

    useEffect(() => {
        getMicrobiologyData()
        getWHONETData()
    }, []);


    return (
        <Routes>
            {microbiologyRoutes.map(route => (
                <Route path={route.path} element={<route.component/>} key={route.path}/>
            ))}
        </Routes>
    )
}