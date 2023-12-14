import styles from "../styles/Listing.module.css"
import {useListing} from "../hooks/useListing";
import {MyTable} from "../../../shared/components/Tables/Table";
import {Input} from "antd";

export const MicrobiologyListing = () => {

    const {
        searchString,
        handleSearch,
        categories,
        tableColumns,
        loading,
        records,
        handleChange,
        navigate
    } = useListing()

    return (
            <div className={styles.tableContainer}>
                <div className={styles.titleContainer}>
                    <p >Microbiology Data</p>
                    <button
                        onClick={() => navigate("/microbiology-data/upload")}
                        className="outline-btn">UPLOAD NEW RESOURCE
                    </button>
                </div>
                
                <div className={styles.searchContainer}>
                    <Input
                        value={searchString}
                        onChange={handleChange}
                        size="large"
                        id="search"
                        placeholder="Search using document name"
                    />
                    <button className="outline-btn" onClick={handleSearch}>SEARCH</button>
                </div>
                <MyTable
                    rowKey="eventID"
                    columns={tableColumns}
                    data={records}
                    loading={loading}
                />
            </div>
    )
}