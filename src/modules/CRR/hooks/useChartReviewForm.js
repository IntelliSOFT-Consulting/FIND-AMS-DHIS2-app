import {Form, notification} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useDataEngine} from "@dhis2/app-runtime";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import dayjs from "dayjs";
import {findSectionObject} from "../helpers";
import {clearMembers} from "../../../shared/redux/actions";
import {useEntities} from "./useEntities";
import {useInstances} from "./useInstances";
import {useOptions} from "../../../shared/hooks/useOptions";
import {useCRR} from "./useCRR";
import {useDataElements} from "./useDataElements";


export const useChartReviewForm = () => {

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

    const [instanceData, setInstanceData] = useState(null)

    const [recommendationValues, setRecommendationValues] = useState([])

    const [redFlagValues, setRedFlagValues] = useState([])

    const [loading, setLoading] = useState(false)

    const [multiSectionsPopulated, setMultiSectionsPopulated] = useState(false)

    const [chartDataLoading, setChartDataLoading] = useState(false)

    const recommendationRules = [{
        required: true,
        message: "Please select a recommendation"
    }]

    const redFlagRules = [{
        required: true,
        message: "Please select a red flag"
    }]

    const {dataElements} = useSelector(state => state.forms)

    const {id: orgUnitID} = useSelector(state => state.orgUnit)

    const crr = useSelector(state => state.crr)

    const members = useSelector(state => state.members)


    const dispatch = useDispatch()


    const {getEnrollmentData} = useInstances()

    const {getEntityByID, getEntityByName} = useEntities()
    const { getDataElementByName} = useDataElements()

    const {getOptionSetByID} = useOptions()

    const {getForms} = useCRR()

    useEffect(() => {
        getForms()
    }, []);

    const [form] = Form.useForm()

    const {teiID, enrollmentID} = useParams()

    const engine = useDataEngine()

    const navigate = useNavigate()


    const populateMultiselectInitialStates = async ({trackedEntityInstance}) => {
        try {
            const recommendationDataElement = findSectionObject({
                searchString: "Recommendation",
                sectionArray: crr?.stages
            })?.sections[0]?.dataElements[0]


            const recommendationOptions = await getOptionSetByID(recommendationDataElement?.optionSet?.id)

            const allCheckedOptions = trackedEntityInstance?.enrollments[0]?.events.map(item => ({
                code: item.dataValues[0]?.value,
                dataElement: item.dataValues[0]?.dataElement
            }))

            /**
             * Set the initial states of the "other" text fields in the recommendation multi-select section
             */
            const otherRecommendationID = (getDataElementByName("Other recommendation")).id

            const otherRecommendationObject = {}

            otherRecommendationObject[otherRecommendationID] = (allCheckedOptions.find(opt => opt.dataElement === otherRecommendationID))?.code

            setInitialState(prev => ({
                ...prev,
                ...otherRecommendationObject
            }))

            /**
             * Set the initial states of the "other" text fields in the red flags multi-select section
             */
            const otherRedFlagID = (getDataElementByName("Other red flag")).id

            const otherRedFlagObject = {}

            otherRedFlagObject[otherRedFlagID] = (allCheckedOptions.find(opt => opt.dataElement === otherRedFlagID))?.code

            setInitialState(prev => ({
                ...prev,
                ...otherRedFlagObject
            }))


            let selectedRecommendationOptions = allCheckedOptions?.filter(option => option.dataElement === recommendationDataElement.id)

            selectedRecommendationOptions = selectedRecommendationOptions?.map(item => {
                const optionSetObject = recommendationOptions?.find(option => option.code === item.code)
                return optionSetObject.id
            })


            setInitialState(prev => ({
                ...prev,
                recommendation: selectedRecommendationOptions
            }))

            const redFlagsDataElement = findSectionObject({
                searchString: "Flags",
                sectionArray: crr?.stages
            })?.sections[0]?.dataElements[0]


            const redFlagOptions = await getOptionSetByID(redFlagsDataElement?.optionSet?.id)

            let selectedRedFlags = allCheckedOptions?.filter(option => option.dataElement === redFlagsDataElement.id)

            selectedRedFlags = selectedRedFlags?.map(item => {
                const optionSetObject = redFlagOptions?.find(option => option.code === item.code)
                return optionSetObject?.id
            })


            setInitialState(prev => ({
                ...prev,
                redFlags: selectedRedFlags
            }))
        } catch (e) {
            notification.error({
                message: "error",
                description: "Error getting populating event data"
            })
        } finally {
            setMultiSectionsPopulated(true)
        }
    }

    const getChart = async () => {
        try {
            setChartDataLoading(true)

            const response = await engine.query({
                trackedEntityInstance: {
                    resource: `trackedEntityInstances/${teiID}`,
                    params: {
                        fields: "trackedEntityInstance,trackedEntityType, attributes[*],enrollments[*],createdAt",
                    }
                }
            })

            setInstanceData(response.trackedEntityInstance)
            await populateMultiselectInitialStates({trackedEntityInstance: response.trackedEntityInstance})
            const firstEnrollment = response.trackedEntityInstance.enrollments[0]

            firstEnrollment.attributes.forEach(item => {
                const newObject = {}

                if (item.valueType === "DATE")
                    newObject[item.attribute] = dayjs(item.value)
                else
                    newObject[item.attribute] = item.value

                setInitialState(prevState => ({
                    ...prevState,
                    ...newObject
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

    useEffect(() => {
        if (teiID  && crr.stages)
            getChart()
        if (!teiID)
            setMultiSectionsPopulated(true)
    }, [teiID, dataElements, crr]);

    const updateEvents = async ({
                                    currentRedFlagDataValues,
                                    currentRecommendationDataValues,
                                    currentOtherRedFlagValue,
                                    currentOtherRecommendationValue,
                                    trackedEntityInstance,
                                    wardOrgUnit
                                }) => {
        const allOriginalEvents = instanceData?.enrollments[0]?.events;
        const recommendationStageID = (crr?.stages?.find(stage => stage?.title?.toLowerCase().includes("recommendation")))?.id
        const redFlagsStageID = (crr?.stages?.find(stage => stage?.title?.toLowerCase()?.includes("flag")))?.id
        const originalRecommendationEvents = allOriginalEvents?.filter(event => event?.programStage === recommendationStageID)
        const originalRedFlagEvents = allOriginalEvents?.filter(event => event.programStage === redFlagsStageID)


        const newRecommendationDataValues = currentRecommendationDataValues?.filter(dataValue => !originalRecommendationEvents?.some(event => event?.dataValues[0]?.value === dataValue?.value))?.filter(dataValue => dataValue?.value)
        const discardedRecommendationEvents = originalRecommendationEvents?.filter(event => !currentRecommendationDataValues?.some(dataValue => dataValue?.value === event?.dataValues[0]?.value))

        const newRedFlagDataValues = currentRedFlagDataValues?.filter(dataValue => !originalRedFlagEvents?.some(event => event?.dataValues[0]?.value === dataValue?.value))?.filter(dataValue => dataValue?.value)
        const discardedRedFlagEvents = originalRedFlagEvents?.filter(event => !currentRedFlagDataValues?.some(dataValue => dataValue?.value === event?.dataValues[0]?.value))


        try {
            /**
             * create events for new recommendation values
             */
            if (newRecommendationDataValues?.length > 0)
                await engine.mutate({
                    resource: "/events",
                    type: "create",
                    data: {
                        events: newRecommendationDataValues.map(dataValue => ({
                            program: crr?.program,
                            programStage: recommendationStageID,
                            trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                            orgUnit: wardOrgUnit,
                            enrollment: enrollmentID,
                            status: "ACTIVE",
                            dataValues: [dataValue],
                            eventDate: new Date().toISOString().slice(0, 10)
                        })),
                    }
                })

            /**
             * create events for new red flag values
             */
            if (newRedFlagDataValues?.length > 0)
                await engine.mutate({
                    resource: "/events",
                    type: "create",
                    data: {
                        events: newRedFlagDataValues.map(dataValue => ({
                            program: crr?.program,
                            programStage: redFlagsStageID,
                            trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                            orgUnit: wardOrgUnit,
                            enrollment: enrollmentID,
                            status: "ACTIVE",
                            dataValues: [dataValue],
                            eventDate: new Date().toISOString().slice(0, 10)
                        })),
                    },
                })

            /**
             * Create Events for other recommendation flag values
             */
            if(currentOtherRecommendationValue?.value)
                await engine.mutate({
                    resource: "/events",
                    type: "create",
                    data: {
                        events: [
                            {
                                program: crr.program,
                                programStage: recommendationStageID,
                                trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                                orgUnit: wardOrgUnit,
                                enrollment: enrollmentID,
                                status: "ACTIVE",
                                dataValues: [currentOtherRecommendationValue],
                                eventDate: new Date().toISOString().slice(0, 10)
                            }
                        ]
                    }
                })

            /**
             * Create Events for other red flag values
             */
            if(currentOtherRedFlagValue?.value)
                await engine.mutate({
                    resource: "/events",
                    type: "create",
                    data: {
                        events: [
                            {
                                program: crr.program,
                                programStage: redFlagsStageID,
                                trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                                orgUnit: wardOrgUnit,
                                enrollment: enrollmentID,
                                status: "ACTIVE",
                                dataValues: [currentOtherRedFlagValue],
                                eventDate: new Date().toISOString().slice(0, 10)
                            }
                        ]
                    }
                })

            /**
             * delete discarded recommendation events
             */
            if (discardedRecommendationEvents?.length > 0)
                await engine.mutate({
                    resource: "/events",
                    type: "create",
                    params: {
                        importStrategy: "DELETE"
                    },
                    data: {
                        events: discardedRecommendationEvents.map(event => ({
                            program: crr?.program,
                            programStage: recommendationStageID,
                            trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                            orgUnit: wardOrgUnit,
                            enrollment: enrollmentID,
                            event: event.event
                        })),
                    }
                })

            /**
             * delete discarded red flag events
             */
            if (discardedRedFlagEvents?.length > 0)
                await engine.mutate({
                    resource: "/events",
                    type: "create",
                    params: {
                        importStrategy: "DELETE"
                    },
                    data: {
                        events: discardedRedFlagEvents.map(event => ({
                            program: crr.program,
                            programStage: redFlagsStageID,
                            trackedEntityInstance: trackedEntityInstance.trackedEntityInstance,
                            orgUnit: wardOrgUnit,
                            enrollment: enrollmentID,
                            event: event.event
                        })),
                    }
                })
            return 200
        } catch (e) {
            return 400
        } finally {
            setLoading(false)
        }
    }

    const getMultiSelectElementInSection = ({sectionString}) => {
        const dataElement = (findSectionObject({searchString: sectionString, sectionArray: crr.stages}))?.sections[0].dataElements.find(dataElement => dataElement.options)
        return dataElement
    }

    const getOtherDataElementInSection = ({sectionString}) => {
        const dataElement = (findSectionObject({searchString: sectionString, sectionArray: crr.stages}))?.sections[0].dataElements.find(dataElement => dataElement.name.toLowerCase().includes("other"))
        return dataElement
    }

    useEffect(() => {
        if (crr.stages)
            getOtherDataElementInSection({sectionString: "Flags"})
    }, [crr]);

    const onFinish = async (values) => {
        const {orgUnits} = await engine.query({
            orgUnits: {
                resource: "organisationUnits.json",
                params: {
                    filter: "level:eq:2",
                    fields: "id,name,code"
                }
            }
        })

        const wardEntity = getEntityByName("Ward (specialty)")

        const wardValue = values[wardEntity.id]

        const orgUnit = orgUnits?.organisationUnits?.find(org => org?.code?.toLowerCase()?.includes(wardValue?.toLowerCase()))

        const payload = {
            trackedEntityType: crr?.trackedEntityType?.id,
            orgUnit: orgUnit?.id || orgUnitID,
            attributes: Object.keys(values)
                .filter(id => id !== getOtherDataElementInSection({sectionString: "Flags"}).id)
                .filter(id => id !== getOtherDataElementInSection({sectionString: "Recommendation"}).id)
                .map(key => ({
                attribute: key,
                value: values[key]
            })).filter(attribute => attribute.value && !Array.isArray(attribute.value)),
            enrollments: [
                {
                    orgUnit: orgUnit?.id || orgUnitID,
                    program: crr.program,
                    enrollmentDate: new Date(),
                    incidentDate: new Date(),
                }
            ]
        }

        /**
         * Add members to attributes
         */
        if (!teiID)
            payload.attributes = [...payload.attributes, {
                attribute: (getEntityByName("members"))?.id,
                value: members.join(";")
            }]

        const mutationQuery = {
            resource: "trackedEntityInstances",
            type: "create",
            data: payload
        }

        if (teiID) {
            mutationQuery.type = "update"
            mutationQuery.resource = `trackedEntityInstances/${teiID}`
        }

        try {
            setLoading(true)
            const {response} = await engine.mutate(mutationQuery)

            if (response?.status === "SUCCESS") {
                const trackedEntityInstance = await getEnrollmentData(teiID === undefined ? response?.importSummaries[0]?.reference : teiID, true)

                const recommendationStage = crr.stages.find(stage => stage.title.toLowerCase().includes("recommendation"))

                const redFlagStage = crr.stages.find(stage => stage.title.toLowerCase().includes("flag"))

                const currentRecommendationDataValues = values["recommendation"].map(value => {
                    const option = formSections.recommendation.dataElements[0].optionSet?.options.find(option => option.id === value)
                    return {
                        dataElement: recommendationStage.sections[0]?.dataElements[0]?.id,
                        value: option.code
                    }
                })

                const currentRedFlagDataValues = values["redFlags"].map(value => {
                    const option = formSections.redFlags.dataElements[0].optionSet?.options.find(option => option.id === value)
                    return {
                        dataElement: redFlagStage.sections[0]?.dataElements[0]?.id,
                        value: option.code
                    }
                })

                const currentOtherRedFlagValue = {
                    value: values[getOtherDataElementInSection({sectionString: "Flag"}).id],
                    dataElement: getOtherDataElementInSection({sectionString: "Flag"}).id
                }

                const currentOtherRecommendationValue = {
                    value: values[getOtherDataElementInSection({sectionString: "Recommendation"}).id],
                    dataElement: getOtherDataElementInSection({sectionString: "Recommendation"}).id
                }


                const updateResponse = await updateEvents({
                    currentRedFlagDataValues,
                    currentRecommendationDataValues,
                    currentOtherRedFlagValue,
                    currentOtherRecommendationValue,
                    trackedEntityInstance,
                    wardOrgUnit: orgUnit?.id || orgUnitID
                })
                updateResponse === 200 && navigate("/crr")
            }


        } catch (e) {
            notification.error({
                message: "error",
                description: "Couldn't save chart"
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

        if (attributeObject?.attributeValues?.length === 0)
            return {validity: true}

        let validity = true

        attributeObject?.attributeValues?.forEach(attribute => {
            const attributeElementId = attribute?.value?.split(",")[0]

            const attributeValuesArray = attribute?.value?.split(",")?.splice(1)

            const conditionalCheck = form?.getFieldValue(attributeElementId)

            if (conditionalCheck === undefined)
                validity = validity
            else
                validity = validity && (attributeValuesArray?.includes(conditionalCheck))

        })

        if (validity === false)
            form.setFieldValue(entityID, "N/A")

        return {validity}

    }

    const checkIfCompulsory = attributeID => {

        const attribute = getEntityByID(attributeID)

        if (attribute?.attributeValues?.length === 0)
            return false

        const compulsoryAttributeIndex = attribute?.attributeValues?.findIndex(attribute => attribute?.attribute?.name?.toLowerCase()?.includes("compulsory"))

        if (compulsoryAttributeIndex === -1) return false

        else return true

    }


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
        teiID,
        getChart,
        onFinish,
        checkIfValid,
        checkIfCompulsory,
        onFieldsChange,
        navigate,
        recommendationRules,
        redFlagRules,
        multiSectionsPopulated
    }

}