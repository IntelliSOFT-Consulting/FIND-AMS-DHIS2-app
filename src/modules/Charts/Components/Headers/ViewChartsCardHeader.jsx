
import styles from "../../styles/ViewCharts.module.css"
import {useNavigate} from "react-router-dom";

/**
 * Card header component
 * @returns {JSX.Element}
 */
export const ViewChartsCardHeader = () => {
    const navigate = useNavigate()
    return (
        <div className="card-header">
            <p className="card-header-text">AMS CHART REVIEW</p>
            <button
                onClick={() => navigate("/charts/members-present-form")}
                className={styles.primaryBtn}>ADD NEW
            </button>
        </div>
    )
}