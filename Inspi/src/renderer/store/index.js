import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import thunkMiddleware from "redux-thunk";
import HYPStorage from "../utils/HYPStorage";

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

store.subscribe(() => {
  const state = store.getState();
  if (state.app.openedProjectPath) {
    HYPStorage.set(state.app.openedProjectPath, state.manifest);
  }
});

export default store;
