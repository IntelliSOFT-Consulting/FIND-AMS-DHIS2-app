import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, Spin} from "antd";
import React from "react";
import styles from "../styles/NewFile.module.css"
import {FormSection} from "../../../shared/components/Forms/FormSection";
import {useNewFile} from "../hooks/useNewFile";


export const NewFile = () => {
    const {
        formSections,
        form,
        navigate,
        loading,
        onFinish,
        fileUploadProps,
        isHidden
    } = useNewFile()

    const linkItems = [
        {
            title: <Link to="/knowledge-hub">Resources</Link>
        },
        {
            title: "New resource"
        },
    ]

    return (
        <Form
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish} form={form} layout="vertical" style={{position: "relative"}}>
            <CardItem title="AMS KNOWLEDGE HUB" linkItems={linkItems}>

                <FormSection
                    checkIfHidden={isHidden}
                    overrideRequired={true}
                    fileUploadProps={fileUploadProps}
                    ordered={false}
                    containerStyles={styles.twoColumnWrapper}
                    section={formSections?.createFile}
                    layoutStyles={{width: "100%", gridColumn: "1/3"}}
                />

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