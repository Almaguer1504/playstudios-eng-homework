import type { Dispatch } from "react";

import axios from "axios";

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

function componentsToObjectId(timestamp: number, machine: number, pid: number, increment: number) {
    const timeHex = timestamp.toString(16).padStart(8, '0');
    const machineHex = machine.toString(16).padStart(6, '0');
    // eslint-disable-next-line no-bitwise
    const pidHex = (pid & 0xFFFF).toString(16).padStart(4, '0');
    const incrementHex = increment.toString(16).padStart(6, '0');
    return timeHex + machineHex + pidHex + incrementHex;
}

export const listPrizes = () => async (dispatch: any) => {
  try {
    dispatch({
      type: PRIZES_LIST_REQUEST,
    });

    const url = `http://127.0.0.1:3000/prizes/`;

    const { data } = await axios.get(url);

    dispatch({
      type: PRIZES_LIST_SUCCESS,
      payload: data.prizes,
    });
  } catch (error: any) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: PRIZES_LIST_FAIL,
      payload: message,
    });
  }
};

export const createPrizeAction = (Name: string, Description: string, Price: number, Category: string, ImageUrl: string) => async (
  dispatch: Dispatch<any>,
) => {
  try {
    dispatch({
      type: PRIZES_CREATE_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true
    };

    const { data } = await axios.post(
      `http://127.0.0.1:3000/prizes`,
      { Name, Description, Price, Category, ImageUrl },
      config
    );

    dispatch({
      type: PRIZES_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: PRIZES_CREATE_FAIL,
      payload: message,
    });
  }
};

export const deletePrizeAction = (id: any) => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({
      type: PRIZES_DELETE_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true
    };

    const url = `http://127.0.0.1:3000/prizes/`;

    const { data } = await axios.delete(`${url}${componentsToObjectId(id.Timestamp, id.Machine, id.Pid, id.Increment)}`, config);

    dispatch({
      type: PRIZES_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({
      type: PRIZES_DELETE_FAIL,
      payload: message,
    });
  }
};
