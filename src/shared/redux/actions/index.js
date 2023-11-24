export const setForms = forms => dispatch => {
    dispatch({
        type: "FORMS",
        payload: forms
    })
}

export const setOrgUnit = orgUnit => dispatch => {
    dispatch({
        type: "ORG_UNIT",
        payload: orgUnit
    })
}


export const setKnowledgeHub = forms => dispatch => {
    dispatch({
        type: "KNOWLEDGE",
        payload: forms
    })
}

export const setUser = user => dispatch => {
    dispatch({
        type: "USER",
        payload: user
    })
}