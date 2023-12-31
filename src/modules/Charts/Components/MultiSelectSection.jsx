import {Checkbox, Form} from "antd";
import styles from "../styles/Multiselect.module.css"

export const MultiSelectSection = ({section, number, setCheckedValues}) => {
    const onChange = (checkedValues) => {
        setCheckedValues(checkedValues)
    };
    return (
        <Form.Item className={styles.parentContainer}>
            <p className={styles.sectionTitle}><span style={{fontWeight: 700}}>{number}.</span>{section.title}</p>
            <Checkbox.Group
                onChange={onChange}
                className={styles.checkboxWrapper}
                options={section?.dataElements?.map(element => ({
                    label: element.name,
                    value: element.id
                }))}/>
        </Form.Item>

    )
}