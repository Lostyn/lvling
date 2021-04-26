import { createSlice } from "@reduxjs/toolkit"

export interface LayoutState {
    gems: boolean,
    guide: boolean,
    note: boolean,
}

const initialState: LayoutState = {
    gems: true,
    guide: true,
    note: true,
}

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleGems: state => { state.gems = !state.gems },
        toggleGuide: state => { state.guide = !state.guide },
        toggleNote: state => { state.note = !state.note },
    }
})

export const { toggleGems, toggleGuide, toggleNote } = layoutSlice.actions;
export default layoutSlice.reducer;