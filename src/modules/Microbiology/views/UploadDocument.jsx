import {CardItem} from "../../../shared/components/Cards/CardItem";
import {useUploadDocument} from "../hooks/useUploadDocument";
import React from "react";
import { Form, Spin, Upload} from "antd";
import styles from "../styles/Upload.module.css"
import {Link} from "react-router-dom";

export const UploadDocument = () => {

    const {
        form,
        loading,
        navigate,
        fileUploadProps,
        onFinish
    } = useUploadDocument()

    const linkItems = [
        {
            title: <Link to="/microbiology-data">Microbiology</Link>
        },
        {
            title: "New upload"
        },
    ]

    return (
        <CardItem title="UPLOAD DOCUMENT" linkItems={linkItems}>
            <Form onFinish={onFinish} layout="vertical" form={form} className={styles.form}>


                <Form.Item
                    className={styles.uploadItem}
                    rules={[
                        {required: true, message: "Please include a file"}
                    ]}
                     name="file">
                    <Upload.Dragger {...fileUploadProps}>
                        <p  className={styles.uploadText}>CLICK OR DROP FILE TO UPLOAD</p>
                    </Upload.Dragger>
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
        </CardItem>
    )
}