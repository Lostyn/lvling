import { initial } from "lodash";
import * as ActionTypes from "../constants/ActionsConstants";
import fs from 'fs'

const initialState = {
    openedProjectPath: null,
    recentFiles: getRecentFromStorage()
};

function getRecentFromStorage() {
    let recents = [];
    try {
      recents = JSON.parse(localStorage.getItem("recents")) || [];
    } catch (e) {}
    
    return recents.filter( file => fs.existsSync(file));
}
  
function saveRecentsToStorage(recents) {
    localStorage.setItem("recents", JSON.stringify(recents));
    return recents;
}

export default function reducer(state = initialState, action) {
    const type = action.type;
    const data = action.payload;
    
    switch(type) {
        case ActionTypes.OPEN_PROJECT:
        case ActionTypes.NEW_PROJECT:
            var recents = [...state.recentFiles];
            if (state.recentFiles.indexOf(data.path) == -1) {
                recents.push(data.path);
                saveRecentsToStorage(recents);
            }

            return Object.assign({}, state, {
              openedProjectPath: data.path,
              recentFiles: [...recents]
            });
        default: 
            return state;
    }
}