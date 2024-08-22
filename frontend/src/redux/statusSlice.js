import { createSlice } from '@reduxjs/toolkit'
// import Spinner from 'react-bootstrap/Spinner';

const statusSlice = createSlice({
  name: 'statuses',
  initialState: {
    live: false,    
    session: null,
    loginTimer:null,
    loginComponents: false,
    updateButton: null,
    statusIndicator: false
  },
  reducers: {
    setLive(state, action){
        state.live = action.payload
    },
    setSession(state, action){
        state.session = action.payload
    },    
    setLoginTimer(state, action){
        state.loginTimer = action.payload
    },
    setLoginComponents(state, action){
        state.loginComponents = action.payload
    },
    setUpdateButton(state, action){
        state.updateButton = action.payload
    },
    setStatusIndicator(state, action){
        state.statusIndicator = action.payload
    }       
  }
})

export const { setLive, setSession, setLoginTimer, setLoginComponents, setUpdateButton, setStatusIndicator } = statusSlice.actions
export default statusSlice.reducer