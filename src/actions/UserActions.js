import axios from 'axios';
import Cookie from "js-cookie"
import {
    GET_ERRORS,
    SET_USER_UPDATE,
    CLEAR_USER_STATUS,
    SET_TOKEN,
} from "./Types";

export const registerUser = (data) => dispatch => {
    console.log("[REDUX] registerUser", data)
    axios.post("/api/v1/user/register", data).then(function(response) {
        if(parseInt(response.data.status) === 200) {
            dispatch({
                type: SET_USER_UPDATE,
                payload: {
                    status: response.data.status
                },
            });
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    errorMsg: response.data.values,
                    status: response.data.status
                },
            });
        }

    }).catch(function(e){
        dispatch({
            type: GET_ERRORS,
            payload: {
                errorMsg: "Error while requesting for data",
                status: "400"
            },
        });
    });
}

export const login = (data) => dispatch => {
    console.log("[REDUX] login")
    axios.post("/api/v1/user/login", data).then(function(response) {
        if(parseInt(response.data.status) === 200) {
            Cookie.set("token", response.data.values.token);
            Cookie.set("userid", response.data.values.id);
            Cookie.set("username", response.data.values.name);
            dispatch({
                type: SET_TOKEN,
                payload: {
                    token: response.data.values.token,
                    userid: response.data.values.id,
                    username: response.data.values.name,
                    status: response.data.status
                },
            });
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    errorMsg: response.data.values,
                    status: response.data.status
                },
            });
        }

    }).catch(function(e){
        dispatch({
            type: GET_ERRORS,
            payload: {
                errorMsg: "Error while requesting for data",
                status: "400"
            },
        });
    });
}

export const changePassword = (id, data) => dispatch => {
    console.log("[REDUX] changePassword")
    axios.put("/api/v1/user/updateuserbyid/" + id, data).then(function(response) {
        if(parseInt(response.data.status) === 200) {
            dispatch({
                type: SET_USER_UPDATE,
                payload: {
                    status: response.data.status
                },
            });
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    errorMsg: response.data.values,
                    status: response.data.status
                },
            });
        }

    }).catch(function(e){
        dispatch({
            type: GET_ERRORS,
            payload: {
                errorMsg: "Error while requesting for data",
                status: "400"
            },
        });
    });
}

export const updateProfile = (id, data) => dispatch => {
    console.log("[REDUX] changePassword")
    axios.post("/api/v1/user/updateuserbyid/" + id, data).then(function(response) {
        if(parseInt(response.data.status) === 200) {
            dispatch({
                type: SET_USER_UPDATE,
                payload: {
                    status: response.data.status
                },
            });
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    errorMsg: response.data.values,
                    status: response.data.status
                },
            });
        }

    }).catch(function(e){
        console.log(e)
        dispatch({
            type: GET_ERRORS,
            payload: {
                errorMsg: "Error while requesting for data",
                status: "400"
            },
        });
    });
}

export const forgotPassword = (id, data) => dispatch => {
    console.log("[REDUX] forgotPassword")
    axios.put("/api/v1/user/updateuserbyid/" + id, data).then(function(response) {
        if(parseInt(response.data.status) === 200) {
            dispatch({
                type: SET_USER_UPDATE,
                payload: {
                    status: response.data.status
                },
            });
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: {
                    errorMsg: response.data.values,
                    status: response.data.status
                },
            });
        }

    }).catch(function(e){
        dispatch({
            type: GET_ERRORS,
            payload: {
                errorMsg: "Error while requesting for data",
                status: "400"
            },
        });
    });
}

export const getToken = () => dispatch => {
    console.log("[REDUX] getToken")
    var token = Cookie.get("token") ? Cookie.get("token") : ""
    var userid = Cookie.get("userid") ? Cookie.get("userid") : 0
    var username = Cookie.get("username") ? Cookie.get("username") : ""
    dispatch({
        type: SET_TOKEN,
        payload: {
            token: token,
            userid: userid,
            username: username,
            status: "200"
        },
    });
}

export const logout = () => dispatch => {
    console.log("[REDUX] logout")
    Cookie.set("token", "");
    Cookie.set("userid", "");
    Cookie.set("username", "");
    dispatch({
        type: SET_TOKEN,
        payload: {
            token: "",
            userid: 0,
            username: "",
            status: "200"
        },
    });
}

export const clearUserStatus = () => dispatch => {
    console.log("[REDUX] clearUserStatus")
    dispatch({
        type: CLEAR_USER_STATUS,
        payload: {
            status: ""
        },
    });
}