import {
  GET_TRANSACTION_HISTORY, GET_TRANSACTION_ERRORS, CLEAR_TRANSACTION_HISTORY
} from "../actions/Types";

const initialState = {
  history: [],
  errorCode: 0,
  totalCount: 0,
  raw: {},
  errMsg: "",
  status: 0
};

export default function (state = initialState, action) {
  console.log(action)
  switch (action.type) {

    case CLEAR_TRANSACTION_HISTORY:
      return {
        ...state,
        history: [],
        errorCode: 0,
        totalCount: 0,
        raw: {}
      };

    case GET_TRANSACTION_HISTORY:
      return {
        ...state,
        history: action.payload.history,
        errorCode: action.payload.errorCode,
        totalCount: action.payload.totalCount,
        raw: action.payload.raw
      };

    case GET_TRANSACTION_ERRORS:
      return {
        ...state,
        errMsg: action.payload.errMsg,
        status: action.payload.status
      };

    default:
      return state;
  }
}
