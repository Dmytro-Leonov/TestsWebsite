import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
});

const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export default setupStore;
