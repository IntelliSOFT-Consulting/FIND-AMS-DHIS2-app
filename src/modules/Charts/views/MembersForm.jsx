import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Form, notification, Space, Spin, Table} from "antd";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import InputItem from "../../../shared/components/Fields/InputItem";
import {useDataEngine} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";
import {useDataElements} from "../hooks/useGetDataElement";
import styles from "../styles/Members.module.css"


export const MembersForm = () => {

    const navigate = useNavigate()
    const [form] = Form.useForm();

    const engine = useDataEngine()
    const {getDataElementByName} = useDataElements()

    const {stages, program} = useSelector(state => state.forms)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const user = useSelector(state => state.user)

    const [members, setMembers] = useState([])
    const [nameElementID, setNameElementID] = useState("")
    const [loading, setLoading] = useState(false)
    const [membersSection, setMembersSection] = useState({})
    const [initialFormValues, setInitialFormValues] = useState({
        "Full Names": user?.name
    })


    /**
     * Init respective form sections once stages are fetched
     */
    useEffect(() => {
        if (stages?.length > 0) {

            const membersObject = stages[0].sections.find(section => section.title.includes("Members"))
            setMembersSection(membersObject)

        }
    }, [stages]);

    useEffect(() => {
        if (membersSection?.dataElements) {
            const fullNamesObject = membersSection.dataElements.find(element => element.name.includes("Full"))
            setNameElementID(fullNamesObject?.id)

        }
    }, [membersSection]);


    const columns = [
        {
            title: 'Full Names',
            dataIndex: 'Full Names',
            key: 'Full Names',
        },
        {
            title: 'Designation',
            dataIndex: 'Designation',
            key: 'Designation',
        },
        {
            title: "Action",
            dataIndex: 'Designation',
            key: 'Designation',
            render: (text, record) => (
                <Space size="middle">
                    <div
                        onClick={() => setMembers(prev => prev.filter(item => item['Full Names'] !== record['Full Names']))}
                        className={styles.removeLink}>
                        Remove
                    </div>
                </Space>
            )
        }
    ]

    const addMembers = () => {
        const formValues = form.getFieldsValue({strict: false})
        const keys = Object.keys(formValues)
        for (const i of keys) {
            if (formValues[i] === undefined) {
                return
            }
        }

        setMembers(prev => prev?.length > 0 ? [...prev, {...formValues}] : [{...formValues}])
        form.resetFields()
    }
    useEffect(() => {
        if (members.length > 0) {
            setInitialFormValues({
                "Full Names": ""
            })
        }
    }, [members.length]);


    const onFinish = async () => {
        let dataValues = []
        members.forEach(member => {
            const keys = Object.keys(member)
            keys.forEach(key => {
                dataValues.push({"dataElement": getDataElementByName(key).id, value: member[key]})
            })
        })

        const payload = {
            events: [
                {
                    "occurredAt": new Date().toJSON().slice(0, 10),
                    "notes": [],
                    program,
                    "programStage": stages[0]?.id,
                    orgUnit: orgUnitID,
                    dataValues
                }
            ]
        }

        try {
            if (members.length < 1)
                return
            setLoading(true)
            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false
                }
            })
            if (response?.status === "OK") {
                navigate(`/charts/new-form/${response?.bundleReport?.typeReportMap?.EVENT.objectReports[0]?.uid}`)
            }

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        } finally {
            setLoading(false)
        }
    }


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
                                    message: `Please input ${dataElement.name}!`,
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