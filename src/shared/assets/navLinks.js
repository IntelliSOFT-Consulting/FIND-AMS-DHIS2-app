import {ArrowTopRightOnSquareIcon, ChartPieIcon, Cog6ToothIcon, DocumentIcon} from "@heroicons/react/24/solid";
import {ArrowUpIcon} from "@heroicons/react/20/solid";
import {HomeOutlined as HomeIcon, PieChartOutlined as Pie} from "@ant-design/icons/lib/icons";
import {ArrowUpOutlined} from "@ant-design/icons";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import React from "react";

const domain = window.location.origin;

export const homeLinks = [
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

export const sidebarItems = [
    {
        label: "Dashboard",
        code: null,
        key: "/",
        icon: <HomeIcon style={{width: "16px", height: "16px"}}/>,
        type: "item",
        external: false,
        checkAccess: false
    },
    {
        label: "Chart review",
        code: "CRR Tracker",
        key: "/crr",
        icon: <Pie style={{width: "16px", height: "16px"}}/>,
        type: "item",
        external: false,
        checkAccess: true
    },
    {
        label: "Knowledge hub",
        code: "AMS KNOWLEDGE HUB",
        key: "/knowledge-hub",
        icon: <ArrowUpOutlined style={{width: "16px", height: "16px"}}/>,
        type: "item",
        external: false,
        checkAccess: true
    },
    {
        label: "Microbiology",
        code: "Microbiology",
        key: "/microbiology-data",
        icon: <DocumentTextIcon style={{width: "16px", height: "16px"}}/>,
        type: "item",
        external: false,
        checkAccess: true
    },
    {
        label: (
            <a href={`${domain}/dhis-web-dashboard`} style={{
                display: "flex",
                gap: "10px",
                justifyContent: "start",
                width: "fit-content",
                alignItems: "center"
            }}>
                <ArrowTopRightOnSquareIcon width={16} height={16}/> Reports
            </a>
        ),
        key: "reports",
        external: true,
        checkAccess: false
    },
    {
        label: (
            <a href={`${domain}/dhis-web-maintenance/index.html#/list/programSection/program`}>
                <Cog6ToothIcon width={16} height={16}/> Configurations
            </a>
        ),
        key: "configuration",
        external: true,
        checkAccess: false
    },
];