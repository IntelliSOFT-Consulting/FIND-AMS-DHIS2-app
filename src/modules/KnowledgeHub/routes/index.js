import {ListGuidelines} from "../views/ListGuidelines";
import {NewFile} from "../views/NewFile";
import {FileView} from "../views/FileView";

export const knowledgeRoutes = [
    {
        path: "/",
        component: ListGuidelines
    },
    {
        path: "/new-file",
        component: NewFile
    },
        {
        path: "/file/:eventId",
        component: FileView
    },

]