import { combineReducers } from 'redux';
// import users from './userReducer';
import windowReducer from './windowReducer';
import statusReducer from './statusReducer';

const rootReducer = combineReducers({
  windowReducer, statusReducer,
});

export default rootReducer;