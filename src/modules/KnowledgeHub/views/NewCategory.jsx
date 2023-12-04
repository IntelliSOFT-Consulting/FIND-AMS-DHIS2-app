import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, Input, Spin} from "antd";
import styles from "../styles/NewFile.module.css"
import React from "react";
import {useNewCategory} from "../hooks/useNewCategory";

export const NewCategory = () => {

    const {loading, onFinish} = useNewCategory()


    return (
        <Form layout="vertical" onFinish={onFinish} style={{position: "relative"}}>
            <CardItem title="New Category">

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