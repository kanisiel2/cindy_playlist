import { createSlice } from '@reduxjs/toolkit'

const windowSlice = createSlice({
  name: 'windows',
  initialState: {
    canvas: false,
    modal: false,
},
  reducers: {
    setCanvasStatus(state, action){
        state.canvas = action.payload
    },
    setModalStatus(state, action){
        state.modal = action.payload
    },    
  }
})

export const { setCanvasStatus, setModalStatus } = windowSlice.actions
export default windowSlice.reducer