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


export const knowledgeHubReducer = (state = {}, action) => {
    switch (action.type) {
        case "KNOWLEDGE":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const microbiologyReducer = (state = {}, action) => {
    switch (action.type) {
        case "MICROBIOLOGY":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const whonetReducer = (state = {}, action) => {
    switch (action.type) {
        case "WHONET":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}


export const userReducer = (state = {}, action) => {
    switch (action.type) {
        case "USER":
            return action.payload

        default:
            return state;
    }
}
