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
import {useInstances} from "./useInstances";


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

    const {getEnrollmentData} = useInstances()

    const {getEntityByID} = useEntities()

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

    const onFinish = async (values) => {
        const payload = {
            trackedEntityType: crr?.trackedEntityType?.id,
            orgUnit: orgUnitID,
            attributes: Object.keys(values).map(key => ({
                attribute: key,
                value: values[key]
            })).filter(attribute => attribute.value && !Array.isArray(attribute.value)),
            enrollments: [
                {
                    orgUnit: orgUnitID,
                    program: crr.program,
                    enrollmentDate: new Date(),
                    incidentDate: new Date(),
                }
            ]
        }

        try {
            setLoading(true)
            const {response} = await engine.mutate({
                resource: "trackedEntityInstances",
                type: "create",
                data: payload
            })
            if (response?.status === "SUCCESS") {
                const trackedEntityInstance = await getEnrollmentData(response?.importSummaries[0]?.reference, true)

                const recommendationStage = crr.stages.find(stage => stage.title.toLowerCase().includes("recommendation"))

                const redFlagStage = crr.stages.find(stage => stage.title.toLowerCase().includes("flag"))

                const recommendationOptionCodes = values["recommendation"].map(value => {
                    const option = formSections.recommendation.dataElements[0].optionSet?.options.find(option => option.id === value)
                    return option.code
                })

                const redFlagOptionCodes = values["redFlags"].map(value => {
                    const option = formSections.redFlags.dataElements[0].optionSet?.options.find(option => option.id === value)
                    return option.code
                })

                await createEvent({
                    trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                    enrollment: trackedEntityInstance.enrollment,
                    selectedOptions: recommendationOptionCodes,
                    dataElementID: formSections.recommendation.dataElements[0]?.id,
                    programStage: recommendationStage.id
                })

                await createEvent({
                    trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                    enrollment: trackedEntityInstance.enrollment,
                    selectedOptions: redFlagOptionCodes,
                    dataElementID: formSections.redFlags.dataElements[0]?.id,
                    programStage: redFlagStage.id
                })
            }

            navigate("/crr")

        } catch (e) {
            console.log(" chart error", e)

            notification.error({
                message: "error",
                description: "Couldn't save chart"
            })
        } finally {
            dispatch(clearMembers())
            setLoading(false)
        }
    }

    const createEvent = async ({trackedEntityInstance, enrollment, selectedOptions, dataElementID, programStage}) => {
        const events = selectedOptions.map(option => ({
            program: crr.program,
            programStage,
            trackedEntityInstance,
            orgUnit: orgUnitID,
            enrollment,
            status: "ACTIVE",
            dataValues: [
                {
                    dataElement: dataElementID,
                    value: option,
                }
            ],
            eventDate: new Date().toISOString().slice(0, 10)
        }))

        try {
            setLoading(true)
            const {response} = await engine.mutate({
                resource: "/events",
                type: "create",
                data: {
                    events
                }
            })


        } catch (e) {
            console.log(" event error", e)
            notification.error({
                message: "error",
                description: "Couldn't save event"
            })
        } finally {
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
                recommendation: findSectionObject({
                    searchString: "Recommendation",
                    sectionArray: crr.stages
                })?.sections[0],
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
        recommendationValues,
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