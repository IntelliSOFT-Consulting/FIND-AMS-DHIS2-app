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

export const setMicrobiology = data => dispatch => {
    dispatch({
        type: "MICROBIOLOGY",
        payload: data
    })
}

export const setWHONET = data => dispatch => {
    dispatch({
        type: "WHONET",
        payload: data
    })
}



export const setUser = user => dispatch => {
    dispatch({
        type: "USER",
        payload: user
    })
}

export const addMemberAction = member =>dispatch =>{
    dispatch({
        type: "ADD_MEMBER",
        payload: member
    })
}

export const setMembersState = member =>dispatch =>{
    dispatch({
        type: "ADD_MEMBER",
        payload: member
    })
}

export const clearMembers = ()=>dispatch=>{
    dispatch({
        type: "CLEAR_MEMBERS"
    })
}

export const removeMember = memberID=>dispatch=>{
    dispatch({
        type: "REMOVE_MEMBER",
        payload: memberID
    })
}


export const setCRR = crrData =>dispatch => {
    dispatch({
        type: "CRR",
        payload: crrData
    })
}