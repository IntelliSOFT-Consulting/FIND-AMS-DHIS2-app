import {Checkbox, Form} from "antd";
import styles from "../styles/Multiselect.module.css"

export const MultiSelectSection = ({section, number, setCheckedValues, initialValue, rules = [], title}) => {
    const onChange = (checkedValues) => {
        setCheckedValues(checkedValues)
    };

    return (
        <div>
            <p className={styles.sectionTitle}><span style={{fontWeight: 700}}>{number}.</span>{section.title}</p>
            <Form.Item
                initialValue={initialValue[title]}
                rules={rules}
                name={title}
                className={styles.parentContainer}>
                <Checkbox.Group
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