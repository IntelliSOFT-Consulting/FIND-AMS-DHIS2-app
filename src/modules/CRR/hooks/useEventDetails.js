import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDataQuery} from "@dhis2/app-runtime";
import {useSelector} from "react-redux";
import {findSectionObject} from "../helpers";
import html2pdf from 'html2pdf.js';
import {useEntities} from "./useEntities";

const query = {
    events: {
        resource: `trackedEntityInstances`,
        params: ({filter = "", program = ""}) => ({
            fields: "trackedEntityInstance,trackedEntityType, attributes[*],enrollments[*],createdAt",
            program,
            ouMode: "ACCESSIBLE",
            filter
        })
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

    const {teiID} = useParams()

    const {data, loading, refetch} = useDataQuery(query)

    const {program, registration, stages, entities} = useSelector(state => state.crr)

    const {getEntityByName} = useEntities()

    const getPatientIP = () => {
        if (formSections.patients.dataElements) {
            const patientIPValue = data?.events?.enrollments[0]?.attributes?.find(attribute => attribute.displayName.toLowerCase()?.includes("ip"))?.value
            setPatientIp(patientIPValue)
        }
    }

    const convertToPdfAndDownload = () => {
        const element = document.getElementById('eventPage')

        html2pdf()
            .from(element)
            .save(`${patientIp}.pdf`);
    }

    useEffect(() => {
        if (registration)
            setFormSections({
                patients: findSectionObject({searchString: "Patients", sectionArray: registration.sections}),
                antibiotics: findSectionObject({searchString: "Antibiotics", sectionArray: registration.sections}),
                cultures: findSectionObject({searchString: "Cultures", sectionArray: registration.sections}),
                dosage: findSectionObject({searchString: "Dosage", sectionArray: registration.sections}),
                recommendation: findSectionObject({
                    searchString: "Recommendation",
                    sectionArray: stages
                })?.sections[0],
                redFlags: findSectionObject({searchString: "Flags", sectionArray: stages})?.sections[0],
                comments: findSectionObject({searchString: "Comments", sectionArray: registration.sections}),
                signature: findSectionObject({searchString: "Signature", sectionArray: registration.sections}),
            })

    }, [registration]);

    useEffect(() => {
        getPatientIP()
    }, [formSections, data]);

    useEffect(() => {
        if (teiID)
            query.events.resource = `trackedEntityInstances/${teiID}`
    }, [teiID]);

    useEffect(() => {
        if (entities && program)
            refetch({
                program: program,
                filter: `${getEntityByName("ip").id}:eq:${teiID}`
            })

    }, [teiID, entities, program]);


    return {formSections, patientIp, loading, data, convertToPdfAndDownload}

}