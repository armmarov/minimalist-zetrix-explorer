import {
  GET_ACCOUNT_ERRORS,
  GET_ACCOUNT_INFO,
  GET_LEDGER_DETAIL, GET_LEDGER_ERRORS
} from "../actions/Types";

const initialState = {
  address: 0,
  balance: 0,
  nonce: 0,
  contract: "",
  metadatas: [],
  raw: {},
  errMsg: "",
  status: 0
};

export default function (state = initialState, action) {
  console.log(action)
  switch (action.type) {

    case GET_ACCOUNT_INFO:
      return {
        ...state,
        address: action.payload.address,
        balance: action.payload.balance,
        nonce: action.payload.nonce,
        contract: action.payload.contract,
        metadatas: action.payload.metadatas,
        status: action.payload.status,
        raw: action.payload.raw
      };

    case GET_ACCOUNT_ERRORS:
      return {
        ...state,
        errMsg: action.payload.errMsg,
        status: action.payload.status
      };

    default:
      return state;
  }
}
