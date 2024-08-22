const initialState = {
    canvas: false,
    modal: false,
};

const windowReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CANVAS_STATUS":
            return { ...state, canvas: action.payload };        
        case "SET_MODAL_STATUS":
            return { ...state, modal: action.payload };
        default:
            return state;
    }
};
  
export default windowReducer;