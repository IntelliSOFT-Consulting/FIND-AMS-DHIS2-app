import {AMSChartLayout} from "./modules/Charts/layout/AMSChartLayout";
import {KnowledgeHub} from "./modules/KnowledgeHub/parent/KnowledgeHub";


const routes = [
    {
        path: "/charts/*",
        component: AMSChartLayout
    },
    {
        path: "/knowledge-hub/*",
        component: KnowledgeHub
    },

];

export default routes;
