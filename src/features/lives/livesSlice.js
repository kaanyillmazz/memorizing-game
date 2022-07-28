import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    livesCount: 10
}
export const livesSlice = createSlice({
    name: 'lives', initialState, reducers: {
        decreaseLives: (state)=> {
            state.livesCount--;
        },
    },
})

export const {decreaseLives} = livesSlice.actions;

export default livesSlice.reducer