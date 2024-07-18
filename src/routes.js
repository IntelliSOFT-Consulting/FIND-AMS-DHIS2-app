import {KnowledgeHub} from "./modules/KnowledgeHub/parent/KnowledgeHub";
import {Microbiology} from "./modules/Microbiology/parent/Microbiology";
import {CRRLayout} from "./modules/CRR/parent/CRRLayout";


const routes = [
    {
        path: "/crr/*",
        component: CRRLayout,
        program: "CRR Tracker"
    },
    {
        path: "/knowledge-hub/*",
        component: KnowledgeHub,
        program: "AMS KNOWLEDGE HUB"
    },
    {
        path: "/microbiology-data/*",
        component: Microbiology,
        program: "Microbiology"
    },

];

export default routes;
