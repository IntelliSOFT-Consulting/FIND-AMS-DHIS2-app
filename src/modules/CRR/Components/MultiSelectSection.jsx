import {Checkbox, Form} from "antd";
import styles from "../styles/Multiselect.module.css"
import {useEffect, useState} from "react";

export const MultiSelectSection = ({
                                       section = {},
                                       number,
                                       rules = [],
                                       title,
                                       form
                                   }) => {

    const [clearingOption, setClearingOption] = useState(null)

    const onChange = (checkedValues) => {
        console.log('checked values', checkedValues)
        const hasClearingValue = checkedValues.includes(clearingOption.id)
        if (hasClearingValue)
            form.setFieldValue(title, [clearingOption.id])
    };


    const getClearingOption = () => {
        const clearingOption = section?.dataElements[0]?.optionSet?.options.find(option => option.attributeValues.find(attribute => attribute.attribute.name === "clear-options"))
        setClearingOption(clearingOption)
    }

    useEffect(() => {

        console.log('section', section.dataElements[0])
        getClearingOption()
    }, [section])

    useEffect(() => {
        console.log('form values', form.getFieldsValue())
    }, [form.getFieldsValue()]);

    return (
        <div>
            <p className={styles.sectionTitle}><span
                style={{fontWeight: 700}}>{number}.</span>{section?.dataElements[0]?.name}</p>
            <Form.Item
                rules={rules}
                name={title}
                className={styles.parentContainer}>
                <Checkbox.Group
                    onChange={onChange}
                    className={styles.checkboxWrapper}
                    options={section?.dataElements[0]?.optionSet?.options?.map(option => ({
                        label: option?.displayName,
                        value: option?.id,
                    }))}/>
            </Form.Item>
        </div>


    )
}

