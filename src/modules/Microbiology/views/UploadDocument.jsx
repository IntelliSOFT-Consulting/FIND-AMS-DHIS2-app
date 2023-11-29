import {CardItem} from "../../../shared/components/Cards/CardItem";
import {useUploadDocument} from "../hooks/useUploadDocument";
import {FormSection} from "../../../shared/components/Forms/FormSection";
import React from "react";
import {Form, Spin} from "antd";
import styles from "../styles/Upload.module.css"

export const UploadDocument = () => {
    const {formSections, form, loading} = useUploadDocument()

    return (
        <CardItem title="UPLOAD DOCUMENT">
            <Form form={form}>
                <FormSection
                    containerStyles={styles.parentContainer}
                    section={formSections?.sections[0]}
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
            </Form>
        </CardItem>
    )
}