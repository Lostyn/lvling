import { combineReducers } from "redux";
import progress, { ProgressState } from './Progress'


export interface RootState {
    progress: ProgressState
}

const reducers = combineReducers({
    progress
})

export default reducers;