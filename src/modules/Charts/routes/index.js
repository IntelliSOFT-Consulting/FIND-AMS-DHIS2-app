import {AMSTableComponent} from "../views/AMSTableComponent";
import {MembersForm} from "../views/MembersForm";
import {NewForm} from "../views/NewForm";
import {ChartDetails} from "../../../shared/pages/ChartDetails";

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
        path: "/new-form/:eventId",
        component: NewForm
    },
    {
        path: "/event/:eventID",
        component: ChartDetails
    },


]