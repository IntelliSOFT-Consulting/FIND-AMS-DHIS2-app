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
    primaryBtn: {
        padding: ".2rem 2rem",
        borderRadius: "6px",
        color: "#1d5288",
        fontWeight: "600",
        border: "0",
        cursor: "pointer",
        fontSize: "8px",
        "@media(min-width: 768px)": {
            alignSelf: "center",
            padding: "0.7rem 3.5rem",
            "fontSize": "14px",
            fontWeight: 600,
        }
    }
})


export const MembersForm = () => {
    const styles = useStyles()

    const navigate = useNavigate()
    const [form] = Form.useForm();

    const engine = useDataEngine()

    const {stages, program} = useSelector(state => state.forms)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)


    const [members, setMembers] = useState([])
    const [nameElementID, setNameElementID] = useState("")
    const [loading, setLoading] = useState(false)
    const [membersSection, setMembersSection] = useState({})


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
        let dataValues = []
        members.forEach(member => {
            const keys = Object.keys(member)
            keys.forEach(key => {
                dataValues.push({"dataElement": key, value: member[key]})
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
                className={styles.primaryBtn}>START
            </button>
        </div>
    )


    return (
        <CardItem title={Header()}>
            {membersSection?.dataElements?.length > 0 && (
                <Form
                    className={styles.formContainer} form={form} layout="vertical" onFinish={onFinish}
                    autoComplete="off">
                    {membersSection?.dataElements?.map(dataElement => (
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
            )}

        </CardItem>
    )
}