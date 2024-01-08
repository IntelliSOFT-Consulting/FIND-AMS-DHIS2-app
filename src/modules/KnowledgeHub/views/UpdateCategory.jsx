import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, Input, Spin} from "antd";
import styles from "../styles/NewFile.module.css"

import React from "react";
import {useUpdateCategory} from "../hooks/useUpdateCategory";
import {Link} from "react-router-dom";

export const UpdateCategory = () => {

    const {option, loading, onFinish, navigate} = useUpdateCategory()

    const linkItems = [
        {
            title: <Link to="/knowledge-hub">Resources</Link>
        },
        {
            title: "Edit folder"
        },
    ]

    return (

        <CardItem title="New Category" linkItems={linkItems}>
            {option.name && (
                <Form
                    onFinish={onFinish}
                    initialValues={{
                        name: option.name
                    }}
                    layout="vertical">
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
                </Form>
            )}

        </CardItem>
    )
}