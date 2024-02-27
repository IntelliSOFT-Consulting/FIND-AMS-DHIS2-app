import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {
    crrReducer,
    formsReducer,
    knowledgeHubReducer,
    membersReducer,
    microbiologyReducer,
    orgUnitReducer,
    userReducer,
    whonetReducer
} from "../reducers";
import thunk from "redux-thunk";


const initialState = {}

const reducer = combineReducers({
    forms: formsReducer,
    members: membersReducer,
    orgUnit: orgUnitReducer,
    knowledgeHub: knowledgeHubReducer,
    user: userReducer,
    microbiology: microbiologyReducer,
    whonet: whonetReducer,
    crr: crrReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))