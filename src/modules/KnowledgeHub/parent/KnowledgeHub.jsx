import {Route, Routes} from "react-router-dom";
import {knowledgeRoutes} from "../routes";
import {useEffect} from "react";
import {useKnowledgeHub} from "../../../shared/hooks/useKnowledgeHub";

export const KnowledgeHub = () => {
    const {getKnowledgeForm} = useKnowledgeHub()

    useEffect(() => {
        getKnowledgeForm()
    }, []);


    return (
        <Routes>
            {knowledgeRoutes.map(route => (
                <Route path={route.path} element={<route.component/>} key={route.path}/>
            ))}
        </Routes>
    )
}