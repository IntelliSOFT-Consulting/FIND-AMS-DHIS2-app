import {ViewCharts} from "../views/ViewCharts";
import {MembersForm} from "../views/MembersForm";
import {NewForm} from "../views/NewForm";
import {EventDetails} from "../views/EventDetails";


export const chartRoutes = [
    {
        path: "/",
        component: ViewCharts
    },
    {
        path: "/members-present-form",
        component: MembersForm
    },
    {
        path: "/new-form/:eventId",
        component: NewForm
    },
    {
        path: "/event/:eventId",
        component: EventDetails
    }


]