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
import {persistReducer, persistStore} from "redux-persist";
import storage from "redux-persist/lib/storage";


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

const persistConfig = {
    key: "members",
    storage,
    whitelist: ["members"]
}

const persistedReducer = persistReducer(
    persistConfig,
    reducer
)


const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(persistedReducer, initialState, composeEnhancer(applyMiddleware(thunk)))

export const persistor = persistStore(store)