import {AMSTableComponent} from "../views/AMSTableComponent";
import {MembersForm} from "../views/MembersForm";
import {SubmittedData} from "../views/SubmittedData";
import {NewForm} from "../views/NewForm";

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
        path: "/submitted-form/:eventId",
        component: SubmittedData
    },
    {
        path: "/new-form/:eventId",
        component: NewForm
    },

]