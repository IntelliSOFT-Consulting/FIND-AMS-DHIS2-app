import {Checkbox, Form} from "antd";
import styles from "../styles/Multiselect.module.css"
import {useEffect} from "react";

export const MultiSelectSection = ({section = {}, number, setCheckedValues,checkedValues, initialValue, rules = [], title}) => {
    const onChange = (checkedValues) => {
        console.log('checked values')
        setCheckedValues(prev => prev.includes(checkedValues) ? "" : checkedValues)
    };

    const clearingAttribute = () => {

    }

    useEffect(() => {
        console.log('checked values', checkedValues)
        console.log('intial value', initialValue[title])
    }, [checkedValues, initialValue]);



    return (
        <div>
            <p className={styles.sectionTitle}><span
                style={{fontWeight: 700}}>{number}.</span>{section?.dataElements[0]?.name}</p>
            <Form.Item
                initialValue={initialValue[title]}
                rules={rules}
                name={title}
                className={styles.parentContainer}>
                <Checkbox.Group
                    onChange={onChange}
                    className={styles.checkboxWrapper}
                    options={section?.dataElements[0]?.optionSet?.options?.map(option => ({
                        label: option?.displayName,
                        value: option?.id,
                        // disabled: option?.attributeValues[0]
                    }))}/>
            </Form.Item>
        </div>


    )
}

