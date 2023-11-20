import {ListGuidelines} from "../views/ListGuidelines";
import {NewFile} from "../views/NewFile";

export const knowledgeRoutes = [
    {
        path: "/",
        component: ListGuidelines
    },
    {
        path: "/new-file",
        component: NewFile
    }
]