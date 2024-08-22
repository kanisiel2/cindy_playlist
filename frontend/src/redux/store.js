// import { createStore } from "redux";
// // import rootReducer from "./rootReducer";
// import { composeWithDevTools } from "redux-devtools-extension";
// import { applyMiddleware } from "redux";
// import logger from "redux-logger";
// const enhancer = composeWithDevTools(applyMiddleware(logger));

// const store = createStore(rootReducer, enhancer);

// export default store;

import { configureStore } from '@reduxjs/toolkit'
import statusReducer from './statusSlice'
import windowReducer from './windowSlice'

export const store = configureStore({
  reducer: {
    statuses: statusReducer,
    windows: windowReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      // Ignore these action types
      ignoredActions: ['statuses/setLoginComponents'],
      // Ignore these field paths in all actions
      ignoredActionPaths: ['statuses.loginComponents.$$typeof', 'payload.$$typeof'],
      // Ignore these paths in the state
      ignoredPaths: ['items.dates'],
    },
  }),
})