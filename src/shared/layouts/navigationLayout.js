import React, {useEffect} from "react";
import {
    ArrowDownOutlined as ArrowDownRightIcon,
    HomeOutlined as HomeIcon,
    PieChartOutlined as Pie,
    SettingOutlined as Cog6ToothIcon,
    ArrowUpOutlined
} from "@ant-design/icons";
import {Layout, Menu} from "antd";
import {createUseStyles} from "react-jss";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import routes from "../../routes";
import {useGetForms} from "../hooks/useGetForms";
import {useGetOrgUnit} from "../hooks/useGetOrgUnit";
import {DocumentTextIcon} from "@heroicons/react/24/outline";

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
    getItem("Dashboard", "/", <HomeIcon/>, null, "item"),
    getItem("AMS Chart Review", "/charts", <Pie/>, null, "item"),
    getItem("AMS KNOWLEDGE HUB", "/knowledge-hub", <ArrowUpOutlined/>, null, "item"),
    getItem("MICROBIOLOGY DATA", "/microbiology-data", <DocumentTextIcon style={{width: "16px", height: "16px"}}/>, null, "item"),

    getItem("Reports", "/reports", <ArrowDownRightIcon/>, null, "item"),
    getItem("Configurations", "/configurations", <Cog6ToothIcon/>, null, "item"),
];
const NavigationLayout = ({user, program, organisationUnits}) => {
    const classes = styles();

    const {getForms} = useGetForms()
    const {getOrgUnit} = useGetOrgUnit()

    const navigate = useNavigate();

    const location = useLocation();

    const onClick = (e) => {
        navigate(e.key);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        getForms()
        getOrgUnit()
    }, []);




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
