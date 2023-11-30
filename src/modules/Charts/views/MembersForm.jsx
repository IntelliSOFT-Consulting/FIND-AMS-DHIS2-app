import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, Spin, Table} from "antd";
import InputItem from "../../../shared/components/Fields/InputItem";
import styles from "../styles/Members.module.css"
import {useMembers} from "../hooks/useMembers";


export const MembersForm = () => {

    const {
        members,
        loading,
        membersSection,
        initialFormValues,
        navigate,
        tableColumns,
        addMembers,
        onFinish,
    } = useMembers()


    const Header = () => (
        <div className="card-header">
            <p className="card-header-text">MEMBERS PRESENT</p>
            <button
                onClick={onFinish}
                className={styles.primaryBtn}>START
            </button>
        </div>
    )


    return (
        <CardItem CardHeader={Header}>
            {membersSection?.dataElements?.length > 0 && (
                <Form
                    initialValues={initialFormValues}
                    className={styles.formContainer} form={form} layout="vertical" onFinish={onFinish}
                    autoComplete="off">
                    {membersSection?.dataElements?.map(dataElement => (
                        <Form.Item
                            key={dataElement.id}
                            label={dataElement.name}
                            name={dataElement.name}
                            rules={[
                                {
                                    required: true,
                                    message: `Please input ${dataElement.displayName}!`,
                                },
                                dataElement?.validator ? {validator: eval(dataElement.validator)} : null,
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
                        <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
                    ) : (
                        <button
                            onClick={addMembers}

                            type="button"
                            className={styles.addButton}>ADD
                        </button>
                    )}

                    <Table
                        style={{gridColumn: "1", marginTop: "4rem"}}
                        pagination={members?.length > 10 ? {pageSize: 10} : false}
                        bordered
                        rowKey={record => record["Full Names"]}
                        columns={columns}
                        dataSource={members}
                        locale={{
                            emptyText: (
                                <div>
                                    <p>No Results.</p>
                                </div>
                            ),
                        }}
                    />

                </Form>
            )}

        </CardItem>
    )
}