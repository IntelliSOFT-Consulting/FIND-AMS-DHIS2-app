import {ViewDocuments} from "../views/ViewDocuments";
import {NewFile} from "../views/NewFile";
import {FileView} from "../views/FileView";
import {NewCategory} from "../views/NewCategory";

export const knowledgeRoutes = [
    {
        path: "/",
        component: ViewDocuments
    },
    {
        path: "/new-file",
        component: NewFile
    },
    {
        path: "/file/:eventId",
        component: FileView
    },
    {
        path: "/new-category/:optionSetID",
        component: NewCategory
    },
    {
        path: "/update-category/:optionSetID/:optionID",
        component: NewCategory
    },

]