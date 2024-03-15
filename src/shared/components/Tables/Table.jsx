import {Table} from "antd";

export const MyTable = ({rowKey, columns, loading, data, expandable}) => {
    return (
        <Table
            expandable={expandable}
            rowKey={record =>record[rowKey]}
            loading={loading}
            pagination={data?.length > 10 ? {pageSize: 10} : false}
            dataSource={data}
            columns={columns}
            bordered
            size="middle"
        />
    )
}