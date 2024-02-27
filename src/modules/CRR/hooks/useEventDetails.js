import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {formatChartData} from "../../../shared/helpers/formatData";
import {useDataElements} from "./useDataElements";
import {findSectionObject} from "../helpers";
import html2pdf from 'html2pdf.js';

const query = {
    events: {
        resource: ``,
    }
}

export const useEventDetails = () => {

    const [formSections, setFormSections] = useState({
        patients: {},
        antibiotics: {},
        cultures: {},
        dosage: {},
        recommendation: {},
        redFlags: {},
        comments: {},
        signature: {},
    })

    const [patientIp, setPatientIp] = useState("")

    const {eventId} = useParams()

    const {data, loading} = useDataQuery(query)

    const {stages} = useSelector(state => state.forms)

    const {getDataElementByName} = useDataElements()

    const getPatientIP = () => {

        if (formSections.patients.dataElements) {
            const ipElement = getDataElementByName("ip/op")

            const value = formatChartData({
                dataElement: ipElement.id,
                dataValues: data?.events?.dataValues
            })

            setPatientIp(value)
        }

    }

    const convertToPdfAndDownload = () =>{
        const element  = document.getElementById('eventPage')

        html2pdf()
            .from(element)
            .save(`${patientIp}.pdf`);
    }

    useEffect(() => {

        if (stages?.length > 0)
            setFormSections({
                patients: findSectionObject({searchString: "Patients", sectionArray: stages[0].sections}),
                antibiotics: findSectionObject({searchString: "Antibiotics", sectionArray: stages[0].sections}),
                cultures: findSectionObject({searchString: "Cultures", sectionArray: stages[0].sections}),
                dosage: findSectionObject({searchString: "Dosage", sectionArray: stages[0].sections}),
                recommendation: findSectionObject({searchString: "Recommendation", sectionArray: stages[0].sections}),
                redFlags: findSectionObject({searchString: "Flags", sectionArray: stages[0].sections}),
                comments: findSectionObject({searchString: "Comments", sectionArray: stages[0].sections}),
                signature: findSectionObject({searchString: "signature", sectionArray: stages[0].sections}),
            })

    }, [stages]);

    useEffect(() => {

        getPatientIP()

    }, [formSections, data]);


    useEffect(() => {

        query.events.resource = `tracker/events/${eventId}`

    }, [eventId]);

    return {formSections, patientIp, loading, data, convertToPdfAndDownload}

}