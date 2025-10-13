import {
  PRIZES_LIST_FAIL,
  PRIZES_CREATE_FAIL,
  PRIZES_DELETE_FAIL,
  PRIZES_LIST_REQUEST,
  PRIZES_LIST_SUCCESS,
  PRIZES_CREATE_REQUEST,
  PRIZES_CREATE_SUCCESS,
  PRIZES_DELETE_REQUEST,
  PRIZES_DELETE_SUCCESS,
} from "../constants/prizesConstants";

export const prizeListReducer = (state = { prizes: [] }, action: any) => {
  switch (action.type) {
    case PRIZES_LIST_REQUEST:
      return { loading: true };
    case PRIZES_LIST_SUCCESS:
      return { loading: false, prizes: action.payload.items ?? action.payload };
    case PRIZES_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const prizeCreateReducer = (state = {}, action: any) => {
  switch (action.type) {
    case PRIZES_CREATE_REQUEST:
      return { loading: true };
    case PRIZES_CREATE_SUCCESS:
      return { loading: false, success: true, prize: action.payload };
    case PRIZES_CREATE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const prizeDeleteReducer = (state = {}, action: any) => {
  switch (action.type) {
    case PRIZES_DELETE_REQUEST:
    case "ABILITIES_DUPLICATE_REQUEST":
      return { loading: true };
    case PRIZES_DELETE_SUCCESS:
    case "ABILITIES_DUPLICATE_SUCCESS":
      return { loading: false, success: true };
    case PRIZES_DELETE_FAIL:
    case "ABILITIES_DUPLICATE_FAIL":
      return { loading: false, error: action.payload, success: false };

    default:
      return state;
  }
};
