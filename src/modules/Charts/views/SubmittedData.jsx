import {CardItem} from "../../../shared/components/cards/CardItem";
import {useNavigate} from "react-router-dom";


export const SubmittedData = () => {

    const navigate = useNavigate()


    const Header = () => (
        <div className="card-header">
            <p className="card-header-text">AMS CHART REVIEW: NEW FORM</p>
            <button
                onClick={() => navigate("/charts/submitted-form")}
                className="primary-btn">START
            </button>
        </div>
    )

    return (
        <CardItem title={Header()}>

        </CardItem>
    )
}