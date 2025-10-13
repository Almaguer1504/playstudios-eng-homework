import axios from "axios";

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

function componentsToObjectId(timestamp: number, machine: number, pid: number, increment: number) {
    const timeHex = timestamp.toString(16).padStart(8, '0');
    const machineHex = machine.toString(16).padStart(6, '0');
    // eslint-disable-next-line no-bitwise
    const pidHex = (pid & 0xFFFF).toString(16).padStart(4, '0');
    const incrementHex = increment.toString(16).padStart(6, '0');
    return timeHex + machineHex + pidHex + incrementHex;
}

export const listUsers = () => async (dispatch: any) => {
    try {
        dispatch({
            type: USERS_LIST_REQUEST,
        });

        const config = {
            withCredentials: true
        };

        const url = `http://127.0.0.1:3000/users/`;

        const { data } = await axios.get(url, config);

        dispatch({
            type: USERS_LIST_SUCCESS,
            payload: data.users,
        });
    } catch (error: any) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: USERS_LIST_FAIL,
            payload: message,
        });
    }
};


export const deleteUserAction = (id: any) => async (dispatch: any) => {
    try {
        dispatch({
            type: USERS_DELETE_REQUEST,
        });

        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        };

        const url = `http://127.0.0.1:3000/users/`;

        const { data } = await axios.delete(`${url}${componentsToObjectId(id.Timestamp, id.Machine, id.Pid, id.Increment)}`, config);

        dispatch({
            type: USERS_DELETE_SUCCESS,
            payload: data,
        });
    } catch (error: any) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({
            type: USERS_DELETE_FAIL,
            payload: message,
        });
    }
};



export const login = (Email: string, Password: string) => async (dispatch: any) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });

        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        };

        const url = `http://127.0.0.1:3000/login/`;

        const { data } = await axios.post(
            url,
            { Email, Password },
            config
        );

        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error: any) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const logout = () => async (dispatch: any) => {
    try {

        localStorage.removeItem("userInfo");
        dispatch({ type: USER_LOGOUT });

        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        };

        const url = `http://127.0.0.1:3000/login/`;

        await axios.delete(
            url,
            config
        );

    } catch (error: any) {
        console.log(error);
    }

};

export const register = (Name: string, Role: string, Email: string, PasswordHash: string, IsAdmin: boolean, Pic: string) => async (dispatch: any) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        const config = {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true
        };

        const url = `http://127.0.0.1:3000/users/`;

        const { data } = await axios.post(
            url,
            { Name, Role, Email, PasswordHash, IsAdmin, Pic },
            config
        );

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });

    } catch (error: any) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
