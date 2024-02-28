import {useNavigate} from "react-router-dom";
import {Form, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import styles from "../styles/Members.module.css"
import {addMemberAction, removeMember} from "../../../shared/redux/actions";


export const useMembers = () => {
    const dispatch = useDispatch()

    const [loading] = useState(false)

    const [membersSection, setMembersSection] = useState({})

    const user = useSelector(state => state.user)

    const crr = useSelector(state => state.crr)
    const members = useSelector(state => state.members)


    const [initialFormValues, setInitialFormValues] = useState({
        "Full Names": user?.name
    })

    const navigate = useNavigate()

    const [form] = Form.useForm()

    const tableColumns = [
        {
            title: 'Full Name',
            dataIndex: 'Full name',
            key: 'id',
        },
        {
            title: 'Designation',
            dataIndex: 'Designation',
            key: 'id',
        },
        {
            title: "Action",
            render: (text, record) => (
                <Space size="middle">
                    <div
                        className={styles.removeLink}
                        onClick={() => dispatch(removeMember(record.id))}
                    >
                        Remove
                    </div>
                </Space>
            )
        }
    ]

    const addMembers = () => {
        const formValues = form.getFieldsValue()
        dispatch(addMemberAction({...formValues, id: members.length}))
        form.resetFields()
    }

    const submitForm = async () => {
        if (members.length < 1)
            return
        navigate(`/crr/new-form/new`)
    }


    useEffect(() => {
        if (crr?.registration) {
            setMembersSection(crr.registration.sections.find(section => section.title === "Members"))
        }
    }, [crr]);


    return {
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