import {Checkbox, Form} from "antd";
import styles from "../styles/Multiselect.module.css"

export const MultiSelectSection = ({section = {}, number, setCheckedValues, initialValue, rules = [], title}) => {
   const onChange = (checkedValues) => {
        setCheckedValues(prev =>  prev.includes(checkedValues) ? "": checkedValues)
    };

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
                        value: option?.id
                    }))}/>
            </Form.Item>
        </div>


    )
}

