
import { combineReducers } from 'redux';
import userReducers from './userReducers';

const rootReducer = combineReducers({
    userDetails: userReducers,
})

export default rootReducer;