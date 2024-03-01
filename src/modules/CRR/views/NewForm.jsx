import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, Spin} from "antd";
import {FormSection} from "../../../shared/components/Forms/FormSection";
import styles from "../styles/FormSection.module.css"
import {MultiSelectSection} from "../Components/MultiSelectSection";
import {useNewForm} from "../hooks/useNewForm";


export const NewForm = () => {

    const {
        formSections,
        initialState,
        setRecommendationValues,
        setRedFlagValues,
        loading,
        chartDataLoading,
        form,
        onFinish,
        checkIfValid,
        checkIfCompulsory,
        onFieldsChange,
        redFlagsInitialState,
        recommendationInitialState,
        navigate,
        recommendationRules,
        redFlagRules
    } = useNewForm()

    return (
        <>
            {!chartDataLoading ? (
                    <Form
                        onFieldsChange={onFieldsChange}
                        initialValues={initialState}
                        onFinish={onFinish}
                        form={form}
                        layout="vertical"
                        style={{position: "relative"}}>
                        <CardItem title="AMS CHART REVIEW: NEW FORM">
                            <div className={styles.parentContainer}>
                                <div className={styles.patientDetailsWrapper}>
                                    <div className={styles.title}>PATIENT DETAILS</div>
                                    <FormSection
                                        checkIfCompulsory={checkIfCompulsory}
                                        ordered={false}
                                        containerStyles={styles.patientDetailsSection}
                                        section={formSections.patients}
                                        layoutStyles={{width: "100%", gridColumn: "1/3"}}
                                    />
                                </div>

                                <div className={styles.twoColumnWrapper}>
                                    <FormSection
                                        checkIfValid={checkIfValid}
                                        overrideInputType="RADIO"
                                        section={formSections.antibiotics}
                                        layoutStyles={{width: "100%", gridColumn: "1/3"}}
                                    />
                                    <FormSection
                                        checkIfValid={checkIfValid}
                                        overrideInputType="RADIO"
                                        section={formSections.cultures}
                                        listStyle="a"
                                        placeholderNumber={formSections.antibiotics?.dataElements?.length + 1}
                                        containerStyles={styles.culturesSection}
                                    />
                                </div>


                                <FormSection
                                    overrideRequired
                                    overrideInputType="RADIO"
                                    containerStyles={styles.dosageSection}
                                    startingIndex={formSections.antibiotics?.dataElements?.length + 2}
                                    section={formSections.dosage}
                                />


                                {recommendationInitialState && formSections?.recommendation?.dataElements &&
                                    <MultiSelectSection
                                        title="recommendation"
                                        rules={recommendationRules}
                                        initialValue={recommendationInitialState}
                                        setCheckedValues={setRecommendationValues}
                                        number={formSections?.antibiotics?.dataElements?.length + 2 + formSections.dosage?.dataElements?.length}
                                        section={formSections?.recommendation}
                                    />}


                                {redFlagsInitialState && formSections?.redFlags?.dataElements &&
                                    <MultiSelectSection
                                        title="redFlags"
                                        rules={redFlagRules}
                                        initialValue={redFlagsInitialState}
                                        setCheckedValues={setRedFlagValues}
                                        number={formSections?.antibiotics?.dataElements?.length + 2 + formSections.dosage?.dataElements?.length + 1}
                                        section={formSections?.redFlags}
                                    />
                                }


                                <FormSection
                                    checkIfCompulsory={checkIfCompulsory}
                                    ordered={false}
                                    containerStyles={styles.commentsSection}
                                    section={formSections.comments}
                                />
                                <FormSection
                                    ordered={false}
                                    containerStyles={styles.commentsSection}
                                    section={formSections.signature}
                                />


                            </div>
                            <div className={styles.actionContainer}>
                                {loading ? (
                                    <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
                                ) : (
                                    <>
                                        <button type="button" onClick={() => navigate(-1)}
                                                className={styles.backButton}>BACK
                                        </button>
                                        <button type="submit" className={styles.successButton}>SAVE</button>
                                    </>
                                )}

                            </div>
                        </CardItem>

                    </Form>
                ) :
                <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
            }

        </>


    )
}