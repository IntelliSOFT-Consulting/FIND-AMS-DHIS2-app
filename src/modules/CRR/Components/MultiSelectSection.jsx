import {Checkbox, Form} from "antd";
import styles from "../styles/Multiselect.module.css"
import {useEffect, useState} from "react";
import InputItem from "../../../shared/components/Fields/InputItem";

export const MultiSelectSection = ({
                                       section = {},
                                       number,
                                       rules = [],
                                       title,
                                       form
                                   }) => {

    const [clearingOption, setClearingOption] = useState(null)
    const [otherOption, setOtherOption] = useState(false)
    const [showOtherTextField, setShowOtherTextField] = useState(false)

    const onChange = (checkedValues) => {
        const hasClearingValue = checkedValues.includes(clearingOption.id)
        if (hasClearingValue) {
            form.setFieldValue(title, [clearingOption.id])
            return;
        }

        const hasOtherOption = checkedValues.includes(otherOption.id)
        if (hasOtherOption)
            setShowOtherTextField(true)
        else
            setShowOtherTextField(false)
    };

    const getOptions = () => section?.dataElements.find(dataElementObject => dataElementObject.optionSet !== undefined)

    const getClearingOption = () => {
        const clearingOption = getOptions()?.optionSet?.options.find(option => option.attributeValues.find(attribute => attribute.attribute.name === "clear-options"))
        setClearingOption(clearingOption)
    }

    const getOtherOption = () => {
        const otherOpt = getOptions()?.optionSet?.options.find(option => option.attributeValues.find(attribute => attribute.attribute.name === "other-option"))
        setOtherOption(otherOpt)
    }


    const getOtherDataElement = () => section?.dataElements.find(dataElementObject => dataElementObject.name.toLowerCase().includes("other"))

    useEffect(() => {
        getClearingOption()
        getOtherOption()
    }, [section])


    return (
        <div>
            <p className={styles.sectionTitle}><span
                style={{fontWeight: 700}}>{number}.</span>{section?.dataElements[0]?.name}</p>
            <div className={styles.parentContainer}>
                <Form.Item
                    rules={rules}
                    name={title}
                >
                    <Checkbox.Group
                        onChange={onChange}
                        className={styles.checkboxWrapper}
                        options={getOptions().optionSet?.options?.map(option => ({
                            label: option?.displayName,
                            value: option?.id,
                        }))}/>
                </Form.Item>
                {
                    showOtherTextField && (
                        <Form.Item name={getOtherDataElement().id} label={getOtherDataElement().name}>
                            <InputItem
                                name={getOtherDataElement().name}
                                value={getOtherDataElement().value}
                                type={getOtherDataElement().valueType}/>
                        </Form.Item>
                    )
                }
            </div>


        </div>


    )
}

