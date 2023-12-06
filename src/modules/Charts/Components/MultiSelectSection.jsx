import {Checkbox, Form} from "antd";
import styles from "../styles/Multiselect.module.css"

export const MultiSelectSection = ({section, number, setCheckedValues, initialValues, rules = []}) => {
    const onChange = (checkedValues) => {
        setCheckedValues(checkedValues)
    };
    return (
        <div>
            <p className={styles.sectionTitle}><span style={{fontWeight: 700}}>{number}.</span>{section.title}</p>
            <Form.Item
                // rules={rules}
                // name={section.title}
                className={styles.parentContainer}>
                <Checkbox.Group
                    defaultValue={initialValues}
                    onChange={onChange}
                    className={styles.checkboxWrapper}
                    options={section?.dataElements?.map(element => ({
                        label: element.name,
                        value: element.id
                    }))}/>
            </Form.Item>
        </div>


    )
}