import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, Spin} from "antd";
import InputItem from "../../../shared/components/Fields/InputItem";
import styles from "../styles/Members.module.css"
import {useMembers} from "../hooks/useMembers";
import {MyTable} from "../../../shared/components/Tables/Table";


export const MembersForm = () => {

    const {
        members,
        loading,
        membersSection,
        initialFormValues,
        tableColumns,
        addMembers,
        submitForm,
        form
    } = useMembers()


    const Header = () => (
        <div className="card-header">
            <p className="card-header-text">MEMBERS PRESENT</p>
            <button
                onClick={submitForm}
                className={styles.primaryBtn}>START
            </button>
        </div>
    )


    return (
        <CardItem CardHeader={Header}>
            {membersSection?.dataElements?.length > 0 && (
                <Form
                    initialValues={initialFormValues}
                    className={styles.formContainer}
                    form={form}
                    layout="vertical"
                    onFinish={addMembers}
                    autoComplete="off">
                    {membersSection?.dataElements?.map(dataElement => (
                        <Form.Item
                            key={dataElement.id}
                            label={dataElement.name}
                            name={dataElement.name}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input ${dataElement.name}!`,
                                },
                            ]}
                        >
                            <InputItem
                                type={dataElement.optionSet ? "SELECT" : dataElement.valueType}
                                options={dataElement.optionSet?.options?.map((option) => ({
                                    label: option.name,
                                    value: option.code,
                                }))}
                                placeholder={`Enter ${dataElement.name}`}
                            />
                        </Form.Item>
                    ))}
                    {loading ? (
                        <Spin className={styles.spinner}/>
                    ) : (
                        <button
                            className={styles.addButton}>ADD
                        </button>
                    )}

                    <div className={styles.tableContainer}>
                        <MyTable columns={tableColumns} data={members} rowKey="Full Names"/>
                    </div>

                </Form>
            )}

        </CardItem>
    )
}