const initialState = {
    live: false,    
    session: null,
    loginComponents: null,
    updateButton: null,
  };
  
  const statusReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LIVE":
            return { ...state, live: action.payload };
        case "SET_SESSION":
            return { ...state, session: action.payload };
        case "SET_LOGINTIMER":
            return { ...state, loginComponents: action.payload };
        case "SET_LOGINCOMPONENTS":
            return { ...state, loginComponents: action.payload };
        case "SET_UPDATEBUTTON":
            return { ...state, updateButton: action.payload };
        default:
            return state;
    }
  };
  
  export default statusReducer;