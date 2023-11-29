import {Route, Routes} from "react-router-dom";
import {microbiologyRoutes} from "../routes";

export const Microbiology = () => {
    return (
        <Routes>
            {microbiologyRoutes.map(route => (
                <Route path={route.path} element={<route.component/>} key={route.path}/>
            ))}
        </Routes>
    )
}