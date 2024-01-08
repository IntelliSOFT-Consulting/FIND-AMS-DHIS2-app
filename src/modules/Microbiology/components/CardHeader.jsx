import {useNavigate} from "react-router-dom";
import styles from "../../Charts/styles/ViewCharts.module.css";

export const CardHeader = () => {
    const navigate = useNavigate()
    return (
        <div className="card-header">
            <p className="card-header-text">MICROBIOLOGY DATA</p>
            <button
                onClick={() => navigate("/microbiology-data/upload")}
                className={styles.primaryBtn}>UPLOAD NEW FILE</button>
        </div>
    )
}