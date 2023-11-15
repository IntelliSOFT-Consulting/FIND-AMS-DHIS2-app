

export const formsReducer = (state ={}, action)=>{
    switch (action.type){
        case "FORMS":
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}