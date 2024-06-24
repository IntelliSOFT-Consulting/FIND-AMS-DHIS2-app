import {useNavigate} from "react-router-dom";
import { notification, Space} from "antd";
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

    const crr = useSelector(state => state.crr)

    const [dataStoreMembers, setDataStoreMembers] = useState([])

    const [selectedMembers, setSelectedMembers] = useState([])

    const [designationOptions, setDesignationOptions] = useState([])

    const [newMember, setNewMember] = useState({
        name: "",
        designation : ""
    })



    const engine = useDataEngine()

    const navigate = useNavigate()


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


    useEffect(() => {
        fetchAllMembers()
    }, []);

    const handleOptionClick = (memberID) => {
        const exists = selectedMembers?.some(item => item?.id === memberID)
        if (!exists)
            setSelectedMembers(prev => [...prev, dataStoreMembers.find(member => member.id === memberID)])
    }



    const submitForm = async () => {
        try{
            if (selectedMembers.length < 1)
                return
            let serializedMemberIDs = selectedMembers.map((member) => member.id)
            serializedMemberIDs = serializedMemberIDs.join(";")
            dispatch(addMembersAction(serializedMemberIDs))
            navigate(`/crr/new-form/new`)
        }catch(err){
            notification.error({
                message: "Failed to submit",
            })
        }

    }


    useEffect(() => {
        if (crr?.registration){
            setMembersSection(crr.registration.sections.find(section => section.title === "Members"))
            // set options for designation
            const designationDE = (crr.registration.sections.find(section => section.title === "Members")).dataElements?.find(DE => DE.name === "Designation")
            setDesignationOptions(designationDE.optionSet.options)
        }

    }, [crr]);




    return {
        loading,
        membersSection,
        tableColumns,
        submitForm,
        dataStoreMembers,
        handleOptionClick,
        selectedMembers,
        addMemberToDataStore,
        newMember,
        setNewMember,
        designationOptions
    }


}