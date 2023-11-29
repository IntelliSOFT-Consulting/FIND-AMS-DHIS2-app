import {CardItem} from "../../../shared/components/Cards/CardItem";
import {CardHeader} from "../components/CardHeader";
import styles from "../styles/Listing.module.css"
import {Input} from "antd";
import {useListing} from "../hooks/useListing";

export const MicrobiologyListing = () => {

    const {searchString, setSearchString, handleSearch} = useListing()

    return (
        <CardItem CardHeader={CardHeader}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem"}}>
                <Input
                    value={searchString}
                    onChange={evt => setSearchString(evt.target.value)}
                    className={styles.inputs}
                    size="large"
                    id="ip/op"
                    placeholder="Search using document name"
                    label="Filter by Date"
                />
                <button
                    onClick={handleSearch}
                    className="outline-btn">SEARCH
                </button>
            </div>
        </CardItem>
    )
}