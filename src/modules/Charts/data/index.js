

export const chartTableColumns = [
    {
        title: "Patient IP/OP NO.",
        dataIndex: "Patient IP/OP No.",
        key: "Patient IP/OP No.",
    },
    {
        title: "Ward",
        dataIndex: "Ward (specialty)",
        key: "Ward (specialty)",
    },
    {
        title: "Date Added",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text, record) => new Date(record.createdAt).toLocaleDateString()
    },

]