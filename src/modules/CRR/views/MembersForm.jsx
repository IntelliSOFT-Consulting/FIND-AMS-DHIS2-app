import {CardItem} from "../../../shared/components/Cards/CardItem";
import {Button, Divider, Form, Input, Select, Space, Spin} from "antd";
import InputItem from "../../../shared/components/Fields/InputItem";
import styles from "../styles/Members.module.css"
import {useMembers} from "../hooks/useMembers";
import {MyTable} from "../../../shared/components/Tables/Table";
import {PlusOutlined} from "@ant-design/icons";


export const MembersForm = () => {

    const {
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
    } = useMembers()


    const Header = () => (
        <div className="card-header">
            <p className="card-header-text">MEMBERS PRESENT</p>
            <button
                onClick={submitForm}
                className={styles.primaryBtn}>START
            </button>
        </div>
    )


    return (
        <CardItem CardHeader={Header}>
            {membersSection?.dataElements?.length > 0 && (
                <div className={styles.formContainer}>
                    <Select
                        placeholder="Select members present"
                        onChange={handleOptionClick}
                        showSearch
                        optionFilterProp="label"
                        options={dataStoreMembers.map(item => ({
                            label: item.name + " - " + item.designation,
                            value: item.id,
                        }))}
                        dropdownRender={(menu) => (
                            <div className={styles.selectDropdown}>
                                {menu}
                                <Divider style={{margin: "8px 0"}}/>
                                <div className={styles.addContainer}>
                                    <Input
                                        className={styles.addInput}
                                        value={newMember.name}
                                        onChange={e => setNewMember(prev => ({...prev, name: e.target.value}))}
                                        placeHolder="Full Name"/>
                                    <Input
                                        onChange={e => setNewMember(prev => ({...prev, designation: e.target.value}))}
                                        placeholder="Select designation"
                                        value={newMember.designation} list="designation-options" id="designation"/>
                                    <datalist id="designation-options">
                                        {designationOptions.map(item => (
                                            <option key={item.code} value={item.displayName}>{item.displayName}</option>
                                        ))}
                                    </datalist>
                                    <Button onClick={addMemberToDataStore} type="text" icon={<PlusOutlined/>}>
                                        Add member
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                    <p className=""></p>
                    {loading ? (
                        <Spin className={styles.spinner}/>
                    ) : (
                        <button
                            className={styles.addButton}>New
                        </button>
                    )}


                    <div className={styles.tableContainer}>
                        <MyTable columns={tableColumns} data={selectedMembers} rowKey="id"/>
                    </div>

                </div>
            )}

        </CardItem>
    )
}