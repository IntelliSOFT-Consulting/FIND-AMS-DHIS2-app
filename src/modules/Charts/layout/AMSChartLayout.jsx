import {Route, Routes} from "react-router-dom";
import {chartRoutes} from "../routes";

export const AMSChartLayout = () => {
    return (
        <Routes>
            {chartRoutes.map(route=>(
                <Route path={route.path} element={<route.component />} key={route.path} />
            ))}
        </Routes>
    )
}