import {ArrowTopRightOnSquareIcon, ChartPieIcon, Cog6ToothIcon, DocumentIcon} from "@heroicons/react/24/solid";
import {ArrowUpIcon} from "@heroicons/react/20/solid";

const domain = window.location.origin;

export const navLinks = [
    {
        title: "AMS CHART REVIEW",
        code: "CRR Tracker",
        path: `/crr`,
        icon: ChartPieIcon,
        external: false,
        checkAccess: true
    },
    {
        title: "AMS KNOWLEDGE HUB",
        code: "AMS KNOWLEDGE HUB",
        path: `/knowledge-hub`,
        icon: ArrowUpIcon,
        external: false,
        checkAccess: true
    },
    {
        title: "MICROBIOLOGY DATA",
        code: "Microbiology",
        path: `/microbiology-data`,
        icon: DocumentIcon,
        external: false,
        checkAccess: true
    },
    {
        title: "REPORTS",
        code: null,
        path: `${domain}/dhis-web-dashboard`,
        icon: ArrowTopRightOnSquareIcon,
        external: true,
        checkAccess: false
    },
    {
        title: "CONFIGURATIONS",
        code: null,
        path: `${domain}/dhis-web-maintenance/index.html#/list/programSection/program`,
        icon: Cog6ToothIcon,
        external: true,
        checkAccess: false
    },
];