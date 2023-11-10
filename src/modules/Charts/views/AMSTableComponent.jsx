import {Button, Table} from "antd";
import {CardItem} from "../../../shared/components/CardItem";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
    header: {
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between"
    }
})

export const AMSTableComponent = () => {
    const styles = useStyles()

    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    const header = () => (
        <div className={styles.header}>
            <p>AMS CHART REVIEW</p>
            <Button type="primary">Add New</Button>
        </div>
    )
    return (
        <CardItem title={header()}>
            <Table dataSource={dataSource} columns={columns}/>
        </CardItem>
    )
}