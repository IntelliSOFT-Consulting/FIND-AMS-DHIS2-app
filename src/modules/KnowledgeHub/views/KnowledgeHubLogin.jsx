import styles from "../styles/Login.module.css"
import {Link} from "react-router-dom";
import {ArrowUpIcon} from "@heroicons/react/20/solid";
import {Button, Checkbox, Form, Input} from "antd";

export const KnowledgeHubLogin = () => {
    return (
        <div className={styles.container}>
            <Link className={styles.link} to="/knowledge-hub">
                <button className={styles.linkBtn}>
                    <ArrowUpIcon className={styles.linkIcon}/>
                    AMS KNOWLEDGE HUB
                </button>
            </Link>
            <p className={styles.titleText}>AMS DIGITAL HUB</p>

            <Form className={styles.form}>

                <p className={styles.loginText}>LOG IN</p>

                <Form.Item className={styles.formItem} name="username">
                    <Input size="large" placeholder="Enter username"/>
                </Form.Item>

                <Form.Item className={styles.formItem} name="password">
                    <Input.Password size="large"/>
                </Form.Item>

                <Form.Item className={styles.formItem} name="2FA">
                    <Checkbox className={styles.checkboxText}>Login using two factor authentication</Checkbox>
                </Form.Item>

                <Button type="primary" >Sign in</Button>

            </Form>

        </div>
    )
}