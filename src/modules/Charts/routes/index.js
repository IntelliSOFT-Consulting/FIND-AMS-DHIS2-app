import {AMSTableComponent} from "../views/AMSTableComponent";
import {MembersForm} from "../views/MembersForm";
import {SubmittedData} from "../views/SubmittedData";

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
        path: "/submitted-form",
        component: SubmittedData
    },

]