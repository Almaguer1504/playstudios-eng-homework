import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import {
  prizeListReducer,
  prizeCreateReducer,
  prizeDeleteReducer,
} from "./sections/product/reducers/prizesReducers";
import { userListReducer, userLoginReducer, userDeleteReducer, userRegisterReducer } from "./sections/user/reducers/userReducers";

const reducer = combineReducers({
  prizeList: prizeListReducer,
  prizeCreate: prizeCreateReducer,
  prizeDelete: prizeDeleteReducer,

  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
});

const user_info_from_storage = localStorage.getItem("userInfo");
const userInfoFromStorage = user_info_from_storage !== null
  ? JSON.parse(user_info_from_storage)
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const store = configureStore({
  reducer,
  preloadedState: initialState
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

export default store;
