import {AMSChartLayout} from "./modules/Charts/layout/AMSChartLayout";
import {KnowledgeHub} from "./modules/KnowledgeHub/parent/KnowledgeHub";
import {Microbiology} from "./modules/Microbiology/parent/Microbiology";


const routes = [
    {
        path: "/charts/*",
        component: AMSChartLayout
    },
    {
        path: "/knowledge-hub/*",
        component: KnowledgeHub
    },
    {
        path: "/microbiology-data/*",
        component: Microbiology
    },

];

export default routes;
