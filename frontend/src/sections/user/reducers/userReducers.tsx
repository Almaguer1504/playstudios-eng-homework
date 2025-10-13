import {
  USER_LOGOUT,
  USER_LOGIN_FAIL,
  USERS_LIST_FAIL,
  USERS_DELETE_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USERS_LIST_REQUEST,
  USERS_LIST_SUCCESS,
  USER_REGISTER_FAIL,
  USERS_DELETE_REQUEST,
  USERS_DELETE_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../constants/userConstants";

export const userListReducer = (state = { users: [] }, action: any) => {
  switch (action.type) {
    case USERS_LIST_REQUEST:
      return { loading: true };
    case USERS_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case USERS_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, action: any) => {
  switch (action.type) {
    case USERS_DELETE_REQUEST:
      return { loading: true };
    case USERS_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USERS_DELETE_FAIL:
      return { loading: false, error: action.payload, success: false };

    default:
      return state;
  }
};

export const userLoginReducer = (state = {}, action: any) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action: any) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload, success: true };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
