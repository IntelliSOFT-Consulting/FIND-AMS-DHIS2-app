import {useNavigate} from "react-router-dom";
import {Form, notification, Space} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import styles from "../styles/Members.module.css"
import {addMembersAction} from "../../../shared/redux/actions";
import {useDataEngine} from "@dhis2/app-runtime";
import { v4 as uuidv4 } from 'uuid';


export const useMembers = () => {
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const [membersSection, setMembersSection] = useState({})

    const user = useSelector(state => state.user)

    const crr = useSelector(state => state.crr)

    const members = useSelector(state => state.members)

    const [dataStoreMembers, setDataStoreMembers] = useState([])

    const [selectedMembers, setSelectedMembers] = useState([])

    const [designationOptions, setDesignationOptions] = useState([])

    const [newMember, setNewMember] = useState({
        name: "",
        designation : ""
    })

    const [initialFormValues, setInitialFormValues] = useState({
        "Full Names": user?.name
    })

    const engine = useDataEngine()

    const navigate = useNavigate()

    const [form] = Form.useForm()

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'Full name',
        },
        {
            title: "Action",
            render: (text, record) => (
                <Space size="middle">
                    <div
                        className={styles.removeLink}
                        // onClick={() => dispatch(removeMember((record['Full name'])))}
                        onClick={() => setSelectedMembers(prev => prev.filter(member => member.id !== record.id))}
                    >
                        Remove
                    </div>
                </Space>
            )
        }
    ]

    const addMemberToDataStore = async() => {
        try{
            setLoading(true)

            const newMemberPayload = {
                id: uuidv4(),
                ...newMember
            }
            const response = await engine.mutate({
                resource: "dataStore/Members/members",
                type: "update",
                data: [...dataStoreMembers, newMemberPayload]
            })

            setNewMember({
                name: "",
                designation: "",
            })
            setSelectedMembers(prev => [...prev, newMemberPayload])
            setDataStoreMembers(prev => [...prev, newMemberPayload])
        }catch(err){
            notification.error({
                message: "Failed to add",
            })
        }finally {
            setLoading(false)
        }

        if(newMember?.designation && newMember?.name ){

        }
    }


    const addMembers = () => {
        const formValues = form.getFieldsValue()
        const serializedValues = serializeMemberObject(formValues)
        dispatch(addMembersAction(serializedValues))
        form.resetFields()
    }

    const fetchAllMembers = async () => {
        try {
            setLoading(true)
            const response = await engine.query({
                membersStore: {
                    resource: "dataStore/Members/members"
                }
            })
            setDataStoreMembers(response.membersStore)
        } catch (error) {
            notification.error({
                message: "Failed to fetch",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleOptionClick = (memberID) => {
        const exists = selectedMembers?.some(item => item?.id === memberID)
        if (!exists)
            setSelectedMembers(prev => [...prev, dataStoreMembers.find(member => member.id === memberID)])
    }

    useEffect(() => {
        fetchAllMembers()
    }, []);

    const deserializeMembersArray = () => members.map(member => ({
        "Full name": member.split("-")[0],
        "Designation": member.split("-")[1]
    }))

    const serializeMemberObject = item => `${item['Full name']}-${item['Designation']}`

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
        let serializedMemberIDs = selectedMembers.map((member) => member.id)
        serializedMemberIDs = serializedMemberIDs.join(";")
        dispatch(addMembersAction(serializedMemberIDs))
        navigate(`/crr/new-form/new`)
    }


    useEffect(() => {
        if (crr?.registration){
            setMembersSection(crr.registration.sections.find(section => section.title === "Members"))
            // set options for designation
            const designationDE = (crr.registration.sections.find(section => section.title === "Members")).dataElements?.find(DE => DE.name === "Designation")
            setDesignationOptions(designationDE.optionSet.options)
        }

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
        dataStoreMembers,
        handleOptionClick,
        selectedMembers,
        newMember,
        setNewMember,
        addMemberToDataStore,
        designationOptions
    }


}