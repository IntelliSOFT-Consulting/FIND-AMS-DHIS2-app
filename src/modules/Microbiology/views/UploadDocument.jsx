import {CardItem} from "../../../shared/components/Cards/CardItem";
import {useUploadDocument} from "../hooks/useUploadDocument";
import React from "react";
import {DatePicker, Form, Input, Spin, Upload} from "antd";
import styles from "../styles/Upload.module.css"

export const UploadDocument = () => {

    const {
        form,
        loading,
        navigate,
        fileUploadProps,
        onFinish
    } = useUploadDocument()


    return (
        <CardItem title="UPLOAD DOCUMENT">
            <Form onFinish={onFinish} layout="vertical" form={form} className={styles.form}>

                <Form.Item
                    className={styles.formItem}
                    rules={[
                        {required: true, message: "Please fill out the new file name"}
                    ]}
                    label="Rename file" name="rename_file">
                    <Input/>
                </Form.Item>

                <Form.Item
                    className={styles.formItem}
                    rules={[
                        {required: true, message: "Please fill out the reporting period"}
                    ]}
                    label="Reporting period" name="reporting_period">
                    <DatePicker.RangePicker className={styles.rangePicker}/>
                </Form.Item>


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