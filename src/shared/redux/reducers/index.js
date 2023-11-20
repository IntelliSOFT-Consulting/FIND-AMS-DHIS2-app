export const formsReducer = (state = {}, action) => {
    switch (action.type) {
        case "FORMS":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }

}


export const orgUnitReducer = (state = {}, action) => {
    switch (action.type) {
        case "ORG_UNIT":
            return action.payload

        default:
            return state
    }
}


export const membersReducer = (state = [], action) => {
    switch (action.type) {
        case "ADD_MEMBER":
            return {
                ...state,
                ...action.payload
            }
        case 'REMOVE_MEMBER':
            const filtered = state.filter(member => member.id !== action.payload)
            return {
                ...filtered
            }

        default:
            return state
    }
}