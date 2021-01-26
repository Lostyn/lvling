import * as ActionTypes from "../constants/ActionsConstants";

const initialState = {
  devices: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SET_DEVICES:
      const { value } = action;
      return {
        devices: value,
      };
    default:
      return state;
  }
}
