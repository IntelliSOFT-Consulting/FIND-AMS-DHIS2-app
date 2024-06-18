import React, {useEffect} from "react";
import {
    ArrowUpOutlined,
    HomeOutlined as HomeIcon,
    PieChartOutlined as Pie,
    SettingOutlined as Cog6ToothIcon,
} from "@ant-design/icons";
import {Layout, Menu} from "antd";
import {createUseStyles} from "react-jss";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import routes from "../../routes";
import {useGetOrgUnit} from "../hooks/useGetOrgUnit";
import {DocumentTextIcon} from "@heroicons/react/24/outline";
import {useUser} from "../hooks/useUser";
import {ArrowTopRightOnSquareIcon} from "@heroicons/react/24/solid";
import {useSelector} from "react-redux";

const {Content, Sider} = Layout;

const styles = createUseStyles({
    "@global": {
        ".ant-layout-sider": {
            position: "fixed",
            background: "white !important",
        },
        ".ant-layout-sider-zero-width-trigger": {
            background: "#2C6693 !important",
            top: "74px !important",
        },
        ".ant-menu-item": {
            borderBottom: "1px solid #f0f0f0",
            marginBlock: "0px !important",
            padding: "24px !important",
            "&:hover": {
                backgroundColor: "#E3EEF7 !important",
                borderRadius: "0px !important",
            },
        },
    },
    content: {
        padding: "24px",
        overflow: "auto",
        backgroundColor: "#FAFAFA",
        minHeight: "calc(100vh - 48px)",
        width: "100%",
    },
});

const domain = window.location.origin;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const items = [
    getItem("DASHBOARD", "/", <HomeIcon/>, null, "item"),
    getItem("CHART REVIEW", "/crr", <Pie style={{width: "16px", height: "16px"}}/>, null, "item"),
    getItem("AMS KNOWLEDGE HUB", "/knowledge-hub", <ArrowUpOutlined/>, null, "item"),
    getItem("MICROBIOLOGY DATA", "/microbiology-data", <DocumentTextIcon
        style={{width: "16px", height: "16px"}}/>, null, "item"),
    {
        label: (
            <a href={`${domain}/dhis-web-dashboard`}>
                <ArrowTopRightOnSquareIcon width={16} height={16}/> REPORTS
            </a>
        ),
        key: "reports"
    },
    {
        label: (
            <a href={`${domain}/dhis-web-maintenance/index.html#/list/programSection/program`}>
                <Cog6ToothIcon width={16} height={16}/> CONFIGURATIONS
            </a>
        ),
        key: "configuration"
    },
];
const NavigationLayout = ({user}) => {
    const classes = styles();

    const {getOrgUnit} = useGetOrgUnit()
    const {getUser} = useUser()
    const {program, stages} = useSelector(state => state.crr)


    const navigate = useNavigate();

    const location = useLocation();

    const onClick = (e) => {
        navigate(e.key);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        getOrgUnit()
    }, [])

    useEffect(() => {
        if (program) getUser()
    }, [program])



    return (
        <Layout>
            <Sider breakpoint="lg" collapsedWidth="0">
                <Menu onClick={onClick} defaultSelectedKeys={["1"]} defaultOpenKeys={["/"]} mode="inline"
                      items={items}/>
            </Sider>

            <Content className={classes.content}>
                <Routes>
                    {routes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.component user={user}/>}
                        />
                    ))}
                </Routes>
            </Content>
        </Layout>
    );
};
export default NavigationLayout;
