import * as ActionTypes from '../constants/ActionsConstants';

export const openProject = (fileContents, fileName) => ({
    type: ActionTypes.OPEN_PROJECT,
    payload: {
        manifest: fileContents,
        path: fileName,
    },
});

export const createProject = (value) => ({
    type: ActionTypes.NEW_PROJECT,
    payload: {
      path: value,
    },
});