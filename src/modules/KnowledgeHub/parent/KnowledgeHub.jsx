import {Route, Routes} from "react-router-dom";
import {knowledgeRoutes} from "../routes";

export const KnowledgeHub = () => {
    return (
        <Routes>
            {knowledgeRoutes.map(route=>(
                <Route path={route.path} element={<route.component />} key={route.path} />
            ))}
        </Routes>
    )
}