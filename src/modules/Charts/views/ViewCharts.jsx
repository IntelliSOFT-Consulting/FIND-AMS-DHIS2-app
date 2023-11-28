import {Button, DatePicker, Input} from "antd";
import {CardItem} from "../../../shared/components/Cards/CardItem";
import styles from "../styles/ViewCharts.module.css"
import {SideNav} from "../../../shared/components/Nav/SideNav";
import {ViewChartsCardHeader} from "../Components/Headers/ViewChartsCardHeader";
import {MyTable} from "../../../shared/components/Tables/Table";
import {useViewCharts} from "../hooks/useViewCharts";




export const ViewCharts = () => {

    const {
        records,
        date,
        ip,
        wards,
        loading,
        chartTableColumns,
        filterByIp,
        filterByDate,
        clearFilters,
        handleIpNoChange,
        handleDateChange
    } = useViewCharts()




    return (
        <CardItem CardHeader={ViewChartsCardHeader}>
            <div style={{display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem"}}>
                <SideNav
                    title="Wards"
                    options={wards}
                />
                <div className="">
                    <div className={styles.searchContainer}>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%"}}>
                            <label style={{cursor: "pointer"}} htmlFor="date">Filter by Date</label>
                            <div className={styles.inputWrapper}>
                                <DatePicker
                                    onChange={handleDateChange}
                                    value={date}
                                    className={styles.inputs}
                                    size="large"
                                    id="date"
                                    placeholder="Select date"
                                    label="Filter by Date"
                                />
                                <Button
                                    onClick={filterByDate}
                                    className={styles.inputButton}>Go</Button>
                            </div>
                        </div>
                        <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%"}}>
                            <label style={{cursor: "pointer"}} htmlFor="ip/op">Search Specific Records</label>
                            <div className={styles.inputWrapper}>
                                <Input
                                    value={ip}
                                    onChange={handleIpNoChange}
                                    className={styles.inputs}
                                    size="large"
                                    id="ip/op"
                                    placeholder="Search using IP/OP NO."
                                    label="Filter by Date"
                                />
                                <Button
                                    onClick={filterByIp}
                                    className={styles.inputButton}>SEARCH</Button>
                            </div>
                        </div>
                        <Button
                            onClick={clearFilters}
                            danger={true}>Clear filters</Button>
                    </div>

                    <MyTable
                        rowKey="eventUid"
                        loading={loading}
                        data={records}
                        columns={chartTableColumns}
                    />
                </div>
            </div>


        </CardItem>
    )
}