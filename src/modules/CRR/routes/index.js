import {ViewCharts} from "../views/ViewCharts";
import {MembersForm} from "../views/MembersForm";
import {ChartReviewForm} from "../views/ChartReviewForm";
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
        path: "/new-form/new",
        component: ChartReviewForm
    },
    {
        path: "/form/:teiID/:enrollmentID",
        component: ChartReviewForm
    },
    {
        path: "/trackedEntity/:teiID/",
        component: EventDetails
    }


]