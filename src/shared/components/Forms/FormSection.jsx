import {Form} from "antd";
import InputItem from "../Fields/InputItem";
import styles from "../../../modules/Charts/styles/FormSection.module.css"


const Wrapper = ({ordered, children, listStyle, startingIndex, containerStyles}) => ordered ? (
    <ol type={listStyle} start={String(startingIndex)} className={containerStyles}>{children}</ol>
) : (
    <div className={containerStyles}>{children}</div>
)

export const FormSection = ({
                                section,
                                startingIndex = 1,
                                listStyle,
                                containerStyles,
                                childStyles,
                                placeholderNumber,
                                ordered = true,
                                overrideInputType,
                                fileUploadProps,
                                overrideRequired,
                                checkIfValid = () => ({validity: true}),
                                checkIfHidden = () => false,
                                checkIfCompulsory = () => false
                            }) => {


    return (
        <Wrapper ordered={ordered} listStyle={listStyle} containerStyles={containerStyles}
                 startingIndex={startingIndex}>
            {section?.dataElements?.map(dataElement => !checkIfHidden(dataElement.id) && (
                <li key={dataElement.id} className={styles.listStyle}>
                    <p className={styles.placeholderNumber}>{placeholderNumber}</p>
                    <Form.Item
                        className={childStyles}
                        key={dataElement.id}
                        label={dataElement.name}
                        name={dataElement.id}
                        rules={[
                            {
                                required: checkIfCompulsory(dataElement.id) || (overrideRequired && dataElement?.valueType !== "FILE_RESOURCE"),
                                message: `Please input ${dataElement.name}!`,
                            },
                        ]}
                    >
                        <InputItem
                            disabled={!checkIfValid(dataElement.id).validity}
                            fileUploadProps={fileUploadProps}
                            type={overrideInputType ? overrideInputType : dataElement?.optionSet && dataElement?.valueType === "TEXT" ? "SELECT" : dataElement.valueType}
                            options={dataElement.optionSet?.options?.map((option) => ({
                                label: option.name || option?.displayName,
                                value: option.code,
                            }))}
                            placeholder={`Enter ${dataElement.name}`}
                        />
                    </Form.Item>
                </li>
            ))}
        </Wrapper>
    )
}