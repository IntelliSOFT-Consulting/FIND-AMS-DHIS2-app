import {Form, notification} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import {findSectionObject} from "../helpers";
import {useDataElements} from "./useDataElements";
import {clearMembers} from "../../../shared/redux/actions";
import {useEntities} from "./useEntities";


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

    const recommendationRules = [{
        required: true,
        message: "Please select a recommendation"
    }]

    const redFlagRules = [{
        required: true,
        message: "Please select a red flag"
    }]

    const {program, dataElements} = useSelector(state => state.forms)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const members = useSelector(state => state.members)

    const crr = useSelector(state => state.crr)

    const dispatch = useDispatch()

    const {getDataElementByID, getDataElementByName} = useDataElements()

    const {getEntityByName, getEntityByID} = useEntities()

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

            if (dataValues.length > 0) {
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
            }


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
        const {orgUnits} = await engine.query({
            orgUnits: {
                resource: `organisationUnits.json`,
                params: {
                    filter: `level:eq:2`,
                    fields: "id,name,code"
                }
            }
        })

        const wardDataElement = getDataElementByName("Ward (specialty)");

        const wardValue = values[wardDataElement.id]

        const orgUnit = orgUnits?.organisationUnits.find(org => org.code.toLowerCase().includes(wardValue.toLowerCase()));

        let dataValues = Object.keys(values).map(key => ({
            dataElement: key,
            value: values[key]
        }))

        dataValues = dataValues.filter(dataValue => getDataElementByID(dataValue.dataElement)?.id)

        members.forEach(member => {
            dataValues.push(member)
        })

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
                    orgUnit: orgUnit.id || orgUnitID,
                    dataValues
                }
            ]
        }

        if (eventId !== "new")
            payload.events[0].event = eventId

        try {
            setLoading(true)

            const request = {
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false
                }
            }

            if (eventId !== "new") {
                request.params["importStrategy"] = "UPDATE"
                request.params["partial"] = true;
            }

            const response = await engine.mutate({
                resource: "tracker",
                type: "create",
                data: payload,
                params: {
                    async: false,
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
            dispatch(clearMembers())
            setLoading(false)
        }

    }

    const onFieldsChange = (changedFields, allFields) => {
        setFormValues(allFields.map(field => ({name: field.name[0], value: field.value})))
    }

    const checkIfValid = entityID => {
        const formValues = form.getFieldsValue()

        if (formValues === {})
            return {validity: true}

        const attributeObject = getEntityByID(entityID)

        if (attributeObject.attributeValues.length === 0)
            return {validity: true}

        let validity = true

        attributeObject.attributeValues.forEach(attribute => {
            const attributeElementId = attribute.value.split(",")[0]

            const attributeValuesArray = attribute.value.split(",").splice(1)

            const conditionalCheck = form.getFieldValue(attributeElementId)

            if (conditionalCheck === undefined)
                validity = validity
            else
                validity = validity && (attributeValuesArray.includes(conditionalCheck))

        })

        if (validity === false)
            form.setFieldValue(entityID, "N/A")

        return {validity}

    }

    const checkIfCompulsory = attributeID => {

        const attribute = getEntityByID(attributeID)

        if (attribute.attributeValues.length === 0)
            return false

        const compulsoryAttributeIndex = attribute.attributeValues.findIndex(attribute => attribute.attribute.name.toLowerCase().includes("compulsory"))

        if (compulsoryAttributeIndex === -1) return false

        else return true

    }

    const populateMultiselectInitialStates = () => {
        const initialRecommendation = formSections?.recommendation?.dataElements
            ?.map(dataElement => dataElement.id)
            .filter(dataElementId => initialState[dataElementId] == "true")

        setInitialState(prevState => ({
            ...prevState,
            recommendation: formSections?.recommendation?.dataElements
                ?.map(dataElement => dataElement.id)
                .filter(dataElementId => initialState[dataElementId] == "true")
        }))

        setInitialState(prevState => ({
            ...prevState,
            redFlags: formSections?.redFlags?.dataElements
                ?.map(dataElement => dataElement.id)
                .filter(dataElementId => initialState[dataElementId] == "true")
        }))

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
        if (eventId && eventId !== "new" && dataElements)
            getChart()
    }, [eventId, dataElements]);

    useEffect(() => {
        if (crr?.stages?.length > 0)
            setFormSections({
                patients: findSectionObject({searchString: "Patients", sectionArray: crr.registration.sections}),
                antibiotics: findSectionObject({searchString: "Antibiotics", sectionArray: crr.registration.sections}),
                cultures: findSectionObject({searchString: "Cultures", sectionArray: crr.registration.sections}),
                dosage: findSectionObject({searchString: "Dosage", sectionArray: crr.registration.sections}),
                recommendation: findSectionObject({searchString: "Recommendation", sectionArray: crr.stages})?.sections[0],
                redFlags: findSectionObject({searchString: "Flags", sectionArray: crr.stages})?.sections[0],
                comments: findSectionObject({searchString: "Comments", sectionArray: crr.registration.sections}),
                signature: findSectionObject({searchString: "Signature", sectionArray: crr.registration.sections}),
            })
    }, [crr]);


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
        checkIfCompulsory,
        onFieldsChange,
        redFlagsInitialState,
        recommendationInitialState,
        navigate,
        recommendationRules,
        redFlagRules
    }

}