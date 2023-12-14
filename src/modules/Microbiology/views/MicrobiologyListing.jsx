import styles from "../styles/Listing.module.css"
import {useListing} from "../hooks/useListing";
import {MyTable} from "../../../shared/components/Tables/Table";
import {Space, Table} from "antd";
import {DocumentIcon} from "@heroicons/react/24/solid";

export const MicrobiologyListing = () => {

    const {
        loading,
        records,
        navigate
    } = useListing()


    const tableColumns = [
        Table.EXPAND_COLUMN,
        {
            title: '',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <Space>
                    {record.status === "ERROR" ?
                        (<DocumentIcon width="24" color="#ff0000"/>)
                        :
                        (<DocumentIcon width="24" color="#3B7A57"/>)
                    }
                </Space>
            )
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Batch No',
            dataIndex: 'batchNo',
            key: 'batchNo',
            render: (text, record) => (
                <Space>{record?.batchNo?.substring(0, 4) === "null" ? "NULL" : record.batchNo}</Space>
            )
        },
        {
            title: 'Deleted',
            dataIndex: 'deleted',
            key: 'deleted',
        },
        {
            title: 'Ignored',
            dataIndex: 'ignored',
            key: 'ignored',
        },
        {
            title: 'Updated',
            dataIndex: 'updated',
            key: 'updated',
        },
        {
            title: 'Imported',
            dataIndex: 'imported',
            key: 'imported',
        },

    ]


    return (
        <div className={styles.tableContainer}>
            <div className={styles.titleContainer}>
                <p>Microbiology Import Logs</p>
                <button
                    onClick={() => navigate("/microbiology-data/upload")}
                    className="outline-btn">UPLOAD NEW RESOURCE
                </button>
            </div>
            <MyTable
                expandable={{
                    expandedRowRender: record => (
                        <Space size="middle">
                            {record.conflictValues && record.conflictValues.map((conflictValue, key) => (
                                <p className={styles.conflict} key={key}>{conflictValue}</p>
                            ))}
                        </Space>
                    ),
                    rowExpandable: record => record.conflictValues !== null
                }}
                rowKey="batchNo"
                columns={tableColumns}
                data={records}
                loading={loading}
            />

        </div>
    )
}