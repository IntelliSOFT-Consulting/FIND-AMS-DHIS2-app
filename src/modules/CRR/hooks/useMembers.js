import {useNavigate} from "react-router-dom";
import {Form, Space} from "antd";
import {useDataElements} from "./useDataElements";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import styles from "../styles/Members.module.css"
import {setMembersState} from "../../../shared/redux/actions";


export const useMembers = () => {
    const dispatch = useDispatch()

    const [members, setMembers] = useState([])

    const [loading] = useState(false)

    const [membersSection, setMembersSection] = useState({})

    const user = useSelector(state => state.user)

    const [initialFormValues, setInitialFormValues] = useState({
        "Full Names": user?.name
    })

    const navigate = useNavigate()

    const [form] = Form.useForm()

    const {getDataElementByName} = useDataElements()

    const {stages} = useSelector(state => state.forms)


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

        setMembers(prev => prev?.length > 0 ? [...prev, {...formValues}] : [{...formValues}])

        form.resetFields()

    }

    const submitForm = async () => {
        if (members.length < 1)
            return

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

        dispatch(setMembersState(dataValues))

        navigate(`/charts/new-form/new`)
    }


    useEffect(() => {
        if (stages?.length > 0)
            setMembersSection(stages[0].sections.find(section => section.title.toLowerCase().includes("members")))
    }, [stages]);


    return {
        members,
        loading,
        membersSection,
        initialFormValues,
        navigate,
        tableColumns,
        addMembers,
        submitForm,
        form
    }


}