import React from 'react'
import {DataQuery} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider} from "antd";
import NavigationLayout from "./shared/layouts/navigationLayout";
import Home from "./shared/pages/Home";
import "./styles/index.css"

const query = {
    me: {
        resource: 'me',
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
        <BrowserRouter>
            <DataQuery query={query}>
                {({error, loading, data}) => {
                    if (error) return <span>ERROR</span>
                    if (loading) return <span>...</span>
                    return (
                        <Routes>
                            <Route
                                path="/*"
                                element={
                                    <NavigationLayout
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
        </BrowserRouter>
    </ConfigProvider>
)

export default MyApp
