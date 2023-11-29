import {useSelector} from "react-redux";
import {useForm} from "antd/es/form/Form";
import {useEffect, useState} from "react";


export const useUploadDocument = () => {
    const {formSections, program, dataElements} = useSelector(state => state.microbiology)

    const [loading, setLoading] = useState(false)

    const [form] = useForm()

    return {
        formSections,
        form,
        loading
    }

}