import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, Input, notification, Spin} from "antd";
import {useDataEngine} from "@dhis2/app-runtime";
import {Link, useNavigate, useParams} from "react-router-dom";
import styles from "../styles/NewFile.module.css"
import React, {useState} from "react";

export const NewCategory = () => {
    const [loading, setLoading] = useState(false)

    const engine = useDataEngine()
    const navigate = useNavigate()

    const {optionSetID} = useParams()

    const onFinish = async (values) => {
        try {
            setLoading(true)
            const payload = {
                code: values.name.toLowerCase(),
                name: values.name,
                optionSet: {
                    id: optionSetID
                },
            }

            /**
             * Create option first
             */
            const firstResponse = await engine.mutate({
                resource: "schemas/option",
                type: "create",
                data: payload,
            })

            /**
             * Add it to the option set
             */
            if (firstResponse.status === "OK") {
                const response = await engine.mutate({
                    resource: "options",
                    type: "create",
                    data: payload,
                })
                if (response?.status === "OK"){
                    navigate(`/knowledge-hub`)
                }

            }


        } catch (e) {
            notification.error({
                message: "Something went wrong"
            })
        }finally {
            setLoading(false)
        }
    }

    const linkItems = [
        {
            title: <Link to="/knowledge-hub">Resources</Link>
        },
        {
            title: "New Folder"
        },
    ]


    return (
        <Form layout="vertical" onFinish={onFinish} style={{position: "relative"}}>
            <CardItem title="New Category" linkItems={linkItems}>

                <Form.Item
                    style={{marginBottom: "16rem"}}
                    rules={[
                        {
                            required: true,
                            message: "Please input the category name!"
                        }
                    ]}
                    label="Category Name"
                    name="name">
                    <Input/>
                </Form.Item>

                <div className={styles.actionContainer}>
                    {loading ? (
                        <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
                    ) : (
                        <>
                            <button type="button"
                                    onClick={() => navigate(-1)}

                                    className={styles.backButton}>BACK
                            </button>
                            <button
                                type="submit" className={styles.successButton}>SUBMIT
                            </button>
                        </>
                    )}
                </div>

            </CardItem>
        </Form>
    )
}