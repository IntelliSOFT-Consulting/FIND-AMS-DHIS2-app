import {AMSTableComponent} from "../views/AMSTableComponent";
import {MembersForm} from "../views/MembersForm";
import {NewForm} from "../views/NewForm";
import {EventDetails} from "../views/EventDetails";


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
        path: "/event/:eventId",
        component: EventDetails
    }


]