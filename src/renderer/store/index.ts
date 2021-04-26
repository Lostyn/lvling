import { combineReducers } from "redux";
import progress, { ProgressState } from './Progress'
import layout, { LayoutState } from './Layout'


export interface RootState {
    progress: ProgressState,
    layout: LayoutState
}

const reducers = combineReducers({
    progress,
    layout
})

export default reducers;