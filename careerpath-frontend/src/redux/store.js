import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from "redux-logger"
const persistConfig = {
    key: 'gfhxchgchgchgchgchchc',
    storage,
}

const middlewares = [rootReducer, logger];
middlewares.push(logger);
const persist = persistReducer(persistConfig, ...middlewares);
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export const store = createStoreWithMiddleware(persist);
export const persistor = persistStore(store);