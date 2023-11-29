import {Form, notification} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import dayjs from "dayjs";
import {findSectionObject} from "../helpers";
import {useDataElements} from "./useGetDataElement";


export const useNewForm = () => {

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

    const [formValues, setFormValues] = useState([])

    const [initialState, setInitialState] = useState({})
    const [recommendationInitialState, setRecommendationInitialState] = useState(null)
    const [redFlagsInitialState, setRedFlagsInitialState] = useState(null)

    const [recommendationValues, setRecommendationValues] = useState([])

    const [redFlagValues, setRedFlagValues] = useState([])

    const [loading, setLoading] = useState(false)

    const [chartDataLoading, setChartDataLoading] = useState(false)

    const {stages, program, dataElements} = useSelector(state => state.forms)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const {getDataElementByID} = useDataElements()

    const [form] = Form.useForm()

    const {eventId} = useParams()

    const engine = useDataEngine()

    const navigate = useNavigate()

    const getChart = async () => {
        try {
            setChartDataLoading(true)

            const response = await engine.query({
                events: {
                    resource: `tracker/events/${eventId}`
                }
            })

            const dataValues = response.events.dataValues

            if (dataValues.length > 0)
                dataValues.forEach(dataValue => {
                    const newObject = {}

                    const dataElementObject = getDataElementByID(dataValue.dataElement)

                    if (dataElementObject.valueType === "DATE")
                        newObject[dataValue.dataElement] = dayjs(dataValue.value)
                    else
                        newObject[dataValue.dataElement] = dataValue.value

                    setInitialState(prevState => ({
                        ...prevState, ...newObject
                    }))
                })


        } catch (e) {
            notification.error({
                message: "error",
                description: "Error getting chart data"
            })
        } finally {
            setChartDataLoading(false)
        }
    }

    const onFinish = async values => {
        const dataValues = Object.keys(values).map(key => ({
            dataElement: key,
            value: values[key]
        }))

        formSections.recommendation.dataElements.forEach(dataElement => {
            if (recommendationValues.includes(dataElement.id))
                dataValues.push({
                    dataElement: dataElement.id,
                    value: true
                })
            else
                dataValues.push({
                    dataElement: dataElement.id,
                })
        })

        formSections.redFlags.dataElements.forEach(dataElement => {
            if (redFlagValues.includes(dataElement.id))
                dataValues.push({
                    dataElement: dataElement.id,
                    value: true
                })
            else
                dataValues.push({
                    dataElement: dataElement.id,
                })
        })

        const payload = {
            events: [
                {
                    "occurredAt": new Date().toJSON().slice(0, 10),
                    "notes": [],
                    program,
                    "programStage": stages[0].id,
                    orgUnit: orgUnitID,
                    event: eventId,
                    dataValues
                }
            ]
        }

        try {
            setLoading(true)

            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false,
                    importStrategy: "UPDATE",
                    partial: true
                }
            })

            if (response?.status === "OK")
                navigate("/charts")

        } catch (e) {
            notification.error({
                message: "error",
                description: "Something went wrong"
            })
        } finally {
            setLoading(false)
        }

    }

    const onFieldsChange = (changedFields, allFields) => {
        setFormValues(allFields.map(field => ({name: field.name[0], value: field.value})))
    }

    const checkIfValid = dataElementID => {
        const formValues = form.getFieldsValue()

        if (formValues === {})
            return {validity: true}

        const dataElementObject = getDataElementByID(dataElementID)

        if (dataElementObject.attributeValues.length === 0)
            return {validity: true}

        let validity = true

        dataElementObject.attributeValues.forEach(attribute => {
            const attributeElementId = attribute.value.split(",")[0]

            const attributeValuesArray = attribute.value.split(",").splice(1)

            const conditionalCheck = form.getFieldValue(attributeElementId)

            if (conditionalCheck === undefined)
                validity = validity
            else
                validity = validity && (attributeValuesArray.includes(conditionalCheck))

        })

        if (validity === false)
            form.setFieldValue(dataElementID, "N/A")

        return {validity}

    }

    const populateMultiselectInitialStates = () => {
        const initialRecommendation = formSections?.recommendation?.dataElements
            ?.map(dataElement => dataElement.id)
            .filter(dataElementId => initialState[dataElementId] == "true")

        const initialRedFlags = formSections?.redFlags?.dataElements
            ?.map(dataElement => dataElement.id)
            .filter(dataElementId => initialState[dataElementId] == "true")

        setRedFlagsInitialState(initialRedFlags)

        setRecommendationInitialState(initialRecommendation)

        setRedFlagValues(initialRedFlags)

        setRecommendationValues(initialRecommendation)

    }

    useEffect(() => {
        if (formSections.recommendation !== {} && formSections.redFlags !== {} && !chartDataLoading)
            populateMultiselectInitialStates()
    }, [formSections, dataElements, chartDataLoading]);

    useEffect(() => {
        if (eventId && dataElements)
            getChart()
    }, [eventId, dataElements]);


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
                signature: findSectionObject({searchString: "Signature", sectionArray: stages[0].sections}),
            })
    }, [stages]);

    return {
        formSections,
        formValues,
        setFormValues,
        initialState,
        setRecommendationValues,
        redFlagValues,
        setRedFlagValues,
        loading,
        chartDataLoading,
        form,
        eventId,
        getChart,
        onFinish,
        checkIfValid,
        onFieldsChange,
        redFlagsInitialState,
        recommendationInitialState,
        navigate
    }

}