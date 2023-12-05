import {useState} from "react";
import {useSelector} from "react-redux";
import {useDataElements} from "./useDataElements";
import {Form} from "antd";
import {useDataEngine} from "@dhis2/app-runtime";
import {useNavigate} from "react-router-dom";

export const useNewFile = () => {

    const [formSections, setFormSections] = useState({createFile: {}})

    const [loading, setLoading] = useState(false)

    const [file, setFile] = useState(null)

    const {stages, program} = useSelector(state => state.knowledgeHub)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const user = useSelector(state => state.user)

    const {getDataElementByID, getDataElementByName} = useDataElements()

    const [form] = Form.useForm()

    const engine = useDataEngine()

    const navigate = useNavigate()


}