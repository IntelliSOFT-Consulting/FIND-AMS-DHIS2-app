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