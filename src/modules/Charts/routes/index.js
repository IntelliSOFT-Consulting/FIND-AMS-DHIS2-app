import {AMSTableComponent} from "../views/AMSTableComponent";
import {MembersForm} from "../views/MembersForm";
import {NewForm} from "../views/NewForm";
import {ViewChart} from "../views/ViewChart.jsx";

export const chartRoutes = [
    {
        path: "/",
        component: AMSTableComponent
    },
    {
        path: "/members-present-form",
        component: MembersForm
    },
    {
        path: "/view-chart/:eventId",
        component: ViewChart
    },
    {
        path: "/new-form/:eventId",
        component: NewForm
    },

]