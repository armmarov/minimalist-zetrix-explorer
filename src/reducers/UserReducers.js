import {
    GET_ERRORS,
    SET_USER_UPDATE,
    CLEAR_USER_STATUS,
    SET_TOKEN
} from "../actions/Types";

const initialState = {
    status: "",
    token: "",
    userid: 0,
    username: "",
    errMsg: ""
};

export default function(state = initialState, action) {
  console.log(action)
  switch (action.type) {    
    
    case SET_TOKEN:
      return {
        ...state,
        token: "WEBAPP " + action.payload.token,
        userid: action.payload.userid,
        username: action.payload.username,
        status: action.payload.status
      };
    
    case SET_USER_UPDATE:
      return {
        ...state,
        status: action.payload.status
      };
    
    case CLEAR_USER_STATUS:
        return {
          ...state,
          status: ""
        }

    case GET_ERRORS:
      return {
        ...state,
        errMsg: action.payload.errMsg,
        status: action.payload.status
      };

    default:
      return state;
  }
}