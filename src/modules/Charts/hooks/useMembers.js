import {useNavigate} from "react-router-dom";
import {Form, notification, Space} from "antd";
import {useDataElements} from "./useDataElements";
import {useSelector} from "react-redux";
import {useState} from "react";
import styles from "../styles/Members.module.css"
import {useDataEngine} from "@dhis2/app-runtime";


export const useMembers = () => {

    const [members, setMembers] = useState([])

    const [loading, setLoading] = useState(false)

    const [membersSection, setMembersSection] = useState({})

    const user = useSelector(state => state.user)

    const [initialFormValues, setInitialFormValues] = useState({
        "Full Names": user?.name
    })

    const navigate = useNavigate()

    const [form] = Form.useForm()

    const {getDataElementByName} = useDataElements()

    const {stages, program} = useSelector(state => state.forms)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const engine = useDataEngine()

    const tableColumns = [
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
            render: (text, record) => (
                <Space size="middle">
                    <div
                        className={styles.removeLink}
                        onClick={() => setMembers(prev => prev.filter(item => item["Full Names"] !== record["Full Names"]))}
                    >
                        Remove
                    </div>
                </Space>
            )
        }
    ]

    const addMembers = () => {

        const formValues = form.getFieldsValue()

        const keys = Object.keys(formValues)

        setMembers(prev => prev?.length > 0 ? [...prev, {...formValues}] : [{...formValues}])

        form.resetFields()

    }

    const onFinish = async () => {

        let dataValues = []

        members.forEach(member => {

            const keys = Object.keys(member)

            keys.forEach(key => {
                dataValues.push({
                    dataElement: getDataElementByName(key).id,
                    value: member[key]
                })
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

            if (response.status === "OK")
                navigate(`/charts/new-form/${response?.bundleReport?.typeReportMap?.EVENT.objectReports[0]?.uid}`)

        } catch (e) {

            notification.error({
                message: "error",
                description: "Something went wrong"
            })

        } finally {

            setLoading(false)

        }

    }


    return{
        members,
        loading,
        membersSection,
        initialFormValues,
        navigate,
        tableColumns,
        addMembers,
        onFinish,
    }


}