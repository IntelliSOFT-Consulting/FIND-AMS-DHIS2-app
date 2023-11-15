import {CardItem} from "../../../shared/components/cards/CardItem";
import {createUseStyles} from "react-jss";
import {Form, notification, Space, Spin, Table} from "antd";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import InputItem from "../../../shared/components/Fields/InputItem";
import {useDataEngine} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";


const useStyles = createUseStyles({
    formContainer: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "2rem",
        alignContent: "center",
        "@media (min-width: 768px)": {
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem 4rem"
        }
    },
    placeholderDiv: {
        display: "hidden",
        "@media (min-width: 768px)": {
            display: "flex"
        }
    },
    removeLink: {
        textDecoration: "underline",
        color: "#ff0000",
        fontStyle: "italic",
        cursor: "pointer"
    },
})


export const MembersForm = () => {
    const styles = useStyles()

    const navigate = useNavigate()
    const [form] = Form.useForm();

    const engine = useDataEngine()

    const {stages, program} = useSelector(state => state.forms)

    const {name: orgUnitName, id: orgUnitID} = useSelector(state => state.orgUnit)

    const membersSection = stages && stages[0].sections[0]

    const [members, setMembers] = useState([])
    const [nameElementID, setNameElementID] = useState("")
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (membersSection?.dataElements) {
            const fullNamesObject = membersSection.dataElements.find(element => element.name.includes("Full"))
            setNameElementID(fullNamesObject.id)

        }
    }, [membersSection]);


    const columns = [
        {
            title: 'Full Names',
            dataIndex: nameElementID,
            key: nameElementID,
        },
        {
            title: "Action",
            dataIndex: nameElementID,
            key: nameElementID,
            render: (text, record) => (
                <Space size="middle">
                    <div
                        onClick={() => setMembers(prev => prev.filter(item => item[nameElementID] !== record[nameElementID]))}
                        className={styles.removeLink}>
                        Remove
                    </div>
                </Space>
            )
        }
    ]

    const addMembers = (values) => {
        const formValues = form.getFieldsValue({strict: false})
        setMembers(prev => prev?.length > 0 ? [...prev, {...formValues}] : [{...formValues}])
        form.resetFields()
    }


    const onFinish = async () => {
        const payload = {
            events: [
                {
                    "occurredAt": new Date().toJSON().slice(0, 10),
                    "notes": [],
                    program,
                    "programStage": stages[0].id,
                    orgUnit: orgUnitID,
                    dataValues: Object.keys(members).map(key => ({
                        dateElement: key,
                        value: members[key]
                    }))
                }
            ]
        }

        try {
            if (members.length < 1)
                return
            setLoading(true)
            const {response} = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload
            })
            if (response?.id) {
                navigate(`/charts/new-form/${response.id}`)
            }

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
            console.log("error", e)
        } finally {
            setLoading(false)
        }
    }


    const Header = () => (
        <div className="card-header">
            <p className="card-header-text">MEMBERS PRESENT</p>
            <button
                onClick={onFinish}
                className="primary-btn">START
            </button>
        </div>
    )


    return (
        <CardItem title={Header()}>
            <Form
                className={styles.formContainer} form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                {membersSection?.dataElements.map(dataElement => (
                    <Form.Item
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
                            type={dataElement.optionSet ? "SELECT" : dataElement.valueType}
                            options={dataElement.optionSet?.options?.map((option) => ({
                                label: option.name,
                                value: option.code,
                            }))}
                            placeholder={`Enter ${dataElement.name}`}
                            name={dataElement.id}
                        />
                    </Form.Item>
                ))}
                {loading ? (
                    <Spin style={{gridColumn: "1", marginLeft: "auto",}}/>
                ) : (
                    <button
                        onClick={addMembers}
                        style={{
                            gridColumn: "1",
                            width: "fit-content",
                            fontWeight: "700",
                            fontSize: "16px",
                            backgroundColor: "#E3EEF7",
                            marginLeft: "auto",
                            padding: ".8rem 4rem"
                        }}
                        type="button"
                        className="primary-btn">ADD
                    </button>
                )}

                <Table
                    style={{gridColumn: "1"}}
                    pagination={members?.length > 10 ? {pageSize: 10} : false}
                    bordered
                    rowKey={record => record[nameElementID]}
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
        </CardItem>
    )
}