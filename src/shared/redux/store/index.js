import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {formsReducer, orgUnitReducer} from "../reducers";
import thunk from "redux-thunk";

const initialState = {}

const reducer = combineReducers({
    forms: formsReducer,
    orgUnit: orgUnitReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))