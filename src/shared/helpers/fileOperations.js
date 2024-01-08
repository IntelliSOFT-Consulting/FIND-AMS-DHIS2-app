import {useState} from "react";


export const useBase64 = ()=>{
    const [base64String, setBase64String] = useState("")

    const convertBlobToBase64 = (blob) =>{
        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result.split(",")[1]
            setBase64String(base64String)
        }
        reader.readAsDataURL(blob)
    }

    return {base64String, convertBlobToBase64}

}