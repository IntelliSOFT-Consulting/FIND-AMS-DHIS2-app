import React from 'react'
import {DataQuery} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider} from "antd";
import AMSLayout from "./shared/layouts/AMSLayout";
import Home from "./shared/views/Home";
import "./styles/index.css"
import {Provider} from "react-redux";
import {store} from "./shared/redux/store/index"

const query = {
    me: {
        resource: 'me',
        params: {
            fields: [
                "all",
                "firstName",
                "surname",
                "organisationUnits[id]",
                "userGroups[id]",
                "userCredentials[:all,!user,userRoles[id]",
            ]
        }
    },
}

const defaultData = {
    borderRadius: 6,
    colorPrimary: "#2C6693",
    Button: {
        colorPrimary: "#2C6693 !important",
        algorithm: "normal",
    },
};

const MyApp = () => (
    <ConfigProvider
        theme={{
            token: {
                colorPrimary: defaultData.colorPrimary,
                borderRadius: defaultData.borderRadius,
            },
            components: {
                Button: {
                    colorPrimary: defaultData.Button?.colorPrimary,
                    algorithm: defaultData.Button?.algorithm,
                },
            },
        }}
        button={{
            style: {
                boxShadow: "none",
            },
        }}
        input={{
            style: {
                "&:hover": {
                    boxShadow: "0 0 0 2px #2C6693 !important",
                },
            },
        }}
    >
        <Provider store={store}>
            <HashRouter>
                <DataQuery query={query}>
                    {({error, loading, data}) => {
                        if (error) return <span>ERROR</span>
                        if (loading) return <span>...</span>
                        return (
                            <Routes>
                                <Route
                                    path="/*"
                                    element={
                                        <AMSLayout
                                            user={data?.me}
                                            title={i18n.t("FIND AMS")}
                                        />
                                    }
                                />
                                <Route
                                    path="/"
                                    element={<Home user={data?.me} title={i18n.t("FIND AMS")}/>}
                                />
                            </Routes>
                        )
                    }}
                </DataQuery>
            </HashRouter>
        </Provider>
    </ConfigProvider>
)

export default MyApp
