import {Route, Routes} from "react-router-dom";
import { crrRoutes} from "../routes";
import {useCRR} from "../hooks/useCRR";
import {useEffect} from "react";

export const CRRLayout = () => {
    const {getForms, getCRRTrackedEntities} = useCRR()

    useEffect(() => {
        getForms()
        getCRRTrackedEntities()
    }, []);

    return (
        <Routes>
            {crrRoutes.map(route=>(
                <Route path={route.path} element={<route.component />} key={route.path} />
            ))}
        </Routes>
    )
}