import React, {useEffect} from "react";
import {Layout, Menu} from "antd";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import routes from "../../routes";
import {useGetOrgUnit} from "../hooks/useGetOrgUnit";
import {useDispatch} from "react-redux";
import {sidebarItems} from "../assets/navLinks";
import {sidebarStyles} from "../styles/sidebarStyles";
import {usePermissions} from "../hooks/usePermissions";
import {setUser} from "../redux/actions";

const {Content, Sider} = Layout;

const AMSLayout = ({user}) => {
    const classes = sidebarStyles();

    const {getOrgUnit} = useGetOrgUnit()

    const dispatch = useDispatch()

    const {exportAllowedLinks, allowedLinks, exportAllowedRoutes, allowedRoutes} = usePermissions()

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
        if (user){
            dispatch(setUser(user))
            exportAllowedLinks({links: sidebarItems, user})
            exportAllowedRoutes({routes, user})
        }

    }, [user]);


    return (
        <Layout>
            <Sider breakpoint="lg" collapsedWidth="0">
                <Menu onClick={onClick} defaultSelectedKeys={[location.pathname]} defaultOpenKeys={[location.pathname]} mode="inline"
                      items={allowedLinks}/>
            </Sider>

            <Content className={classes.content}>
                <Routes>
                    {allowedRoutes.map((route) => (
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
export default AMSLayout;
