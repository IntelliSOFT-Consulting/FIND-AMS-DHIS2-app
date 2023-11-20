export const setForms = forms => dispatch => {
    dispatch({
        type: "FORMS",
        payload: forms
    })
}

export const setOrgUnit = orgUnit => dispatch =>{
    dispatch({
        type: "ORG_UNIT",
        payload: orgUnit
    })
}


export const addMember = member => dispatch =>{
    dispatch({
        type: "ADD_MEMBER",
        payload: member
    })
}

export const removeMember = memberID => dispatch =>{
    dispatch({
        type: "REMOVE_MEMBER",
        payload: memberID
    })
}