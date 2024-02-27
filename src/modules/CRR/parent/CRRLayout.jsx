import {Route, Routes} from "react-router-dom";
import {chartRoutes} from "../routes";
import {useCRR} from "../hooks/useCRR";
import {useEffect} from "react";

export const CRRLayout = () => {
    const {getForms} = useCRR()

    useEffect(() => {
        getForms()
    }, []);

    return (
        <Routes>
            {chartRoutes.map(route=>(
                <Route path={route.path} element={<route.component />} key={route.path} />
            ))}
        </Routes>
    )
}