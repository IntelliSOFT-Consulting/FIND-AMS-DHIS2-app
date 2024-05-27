import {useNavigate} from "react-router-dom";
import {Form, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import styles from "../styles/Members.module.css"
import {addMemberAction, removeMember} from "../../../shared/redux/actions";
import {useDataEngine} from "@dhis2/app-runtime";


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

    const engine = useDataEngine()

    const navigate = useNavigate()

    const [form] = Form.useForm()

    const tableColumns = [
        {
            title: 'Full Name',
            dataIndex: 'Full name',
            key: 'Full name',
        },
        {
            title: 'Designation',
            dataIndex: 'Designation',
            key: 'Full name',
        },
        {
            title: "Action",
            render: (text, record) => (
                <Space size="middle">
                    <div
                        className={styles.removeLink}
                        onClick={() => dispatch(removeMember((record['Full name'])))}
                    >
                        Remove
                    </div>
                </Space>
            )
        }
    ]

    const addMembers = () => {
        const formValues = form.getFieldsValue()
        const serializedValues = serializeMemberObject(formValues)
        dispatch(addMemberAction(serializedValues))
        form.resetFields()
    }

    const deserializeMembersArray =()=>members.map(member=> ({"Full name": member.split("-")[0], "Designation": member.split("-")[1]}))

    const serializeMemberObject = item=>`${item['Full name']}-${item['Designation']}`

    const populateFullName = async () => {
        try {
            const response = await engine.query({
                me: {
                    resource: "me"
                }
            })
            form.setFieldValue("Full name", response.me.name)
        } catch (error) {

        }
    }

    const submitForm = async () => {
        if (members.length < 1)
            return
        navigate(`/crr/new-form/new`)
    }


    useEffect(() => {
        if (crr?.registration)
            setMembersSection(crr.registration.sections.find(section => section.title === "Members"))
    }, [crr]);


    useEffect(() => {
        populateFullName()
    }, [membersSection]);



    return {
        loading,
        membersSection,
        initialFormValues,
        navigate,
        tableColumns,
        addMembers,
        submitForm,
        form,
        deserializeMembersArray,
    }


}