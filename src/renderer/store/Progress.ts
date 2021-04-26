import { createSlice, PayloadAction  } from '@reduxjs/toolkit'
import { findActFromTown, ZoneToAct } from '../datas/ActAndMap'

export interface ProgressState {
    act: number,
    zone: string;
    level: number
}

const initialState: ProgressState = {
    act: 1,
    zone: ZoneToAct[0][0],
    level: 1
}

export interface LevelActionPayload {
    character: string,
    level: number
}

const ME: string = "SplLvlTest"

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setZone: (state, action: PayloadAction<string>) => {
            state.zone = action.payload

            const nextAct = findActFromTown( action.payload );
            if (nextAct > state.act) {
                state.act = nextAct
            }
        },
        setLevel: (state, action: PayloadAction<LevelActionPayload>) => {
            if( action.payload.character === ME) {
                state.level = action.payload.level
            }
        }
    }
})

export const { setZone, setLevel } = progressSlice.actions;
export default progressSlice.reducer;
