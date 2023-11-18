import {Form} from "antd";
import InputItem from "../../../shared/components/Fields/InputItem";
import styles from "../styles/FormSection.module.css"


const Wrapper = ({ordered, children, listStyle, startingIndex, containerStyles}) => ordered ? (
    <ol type={listStyle} start={startingIndex} className={containerStyles}>{children}</ol>
) : (
    <div className={containerStyles}>{children}</div>
)

export const FormSection = ({
                                section,
                                startingIndex=1,
                                listStyle,
                                containerStyles,
                                childStyles,
                                placeholderNumber,
                                ordered = true
                            }) => {

    return (
        <Wrapper ordered={ordered} listStyle={listStyle} containerStyles={containerStyles}
                 startingIndex={startingIndex}>
            {section?.dataElements?.map(dataElement => (
                <li key={dataElement.id} className={styles.listStyle}>
                    <p className={styles.placeholderNumber}>{placeholderNumber}</p>
                    <Form.Item
                        className={childStyles}
                        key={dataElement.id}
                        label={dataElement.name}
                        name={dataElement.id}
                        rules={[
                            {
                                required: dataElement.required,
                                message: `Please input ${dataElement.displayName}!`,
                            },
                            dataElement?.validator ? {validator: eval(dataElement.validator)} : null,
                        ]}
                    >
                        <InputItem
                            type={dataElement?.optionSet && dataElement?.valueType === "TEXT" ? "SELECT" : dataElement.valueType}
                            options={dataElement.optionSet?.options?.map((option) => ({
                                label: option.name || option?.displayName,
                                value: option.code,
                            }))}
                            placeholder={`Enter ${dataElement.name}`}
                            name={dataElement.id}
                        />
                    </Form.Item>
                </li>
            ))}
        </Wrapper>
    )
}