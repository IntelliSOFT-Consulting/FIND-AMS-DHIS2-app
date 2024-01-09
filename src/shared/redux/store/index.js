import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {
    formsReducer,
    knowledgeHubReducer,
    microbiologyReducer,
    orgUnitReducer,
    userReducer,
    whonetReducer
} from "../reducers";
import thunk from "redux-thunk";


const initialState = {}

const reducer = combineReducers({
    forms: formsReducer,
    orgUnit: orgUnitReducer,
    knowledgeHub: knowledgeHubReducer,
    user: userReducer,
    microbiology: microbiologyReducer,
    whonet: whonetReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))