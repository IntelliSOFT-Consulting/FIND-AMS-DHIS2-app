import {ViewCharts} from "../views/ViewCharts";
import {MembersForm} from "../views/MembersForm";
import {NewForm} from "../views/NewForm";
import {EventDetails} from "../views/EventDetails";


export const crrRoutes = [
    {
        path: "/",
        component: ViewCharts
    },
    {
        path: "/members-present-form",
        component: MembersForm
    },
    {
        path: "/new-form/:teiID",
        component: NewForm
    },
    {
        path: "/trackedEntity/:teiID",
        component: EventDetails
    }


]