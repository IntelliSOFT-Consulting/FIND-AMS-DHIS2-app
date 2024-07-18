import {createUseStyles} from "react-jss";

export const sidebarStyles = createUseStyles({
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