import axios from 'axios';
import Cookie from "js-cookie"
import {
  GET_ERRORS,
  SET_USER_UPDATE,
  CLEAR_USER_STATUS,
  SET_TOKEN, GET_TRANSACTION_HISTORY, CLEAR_TRANSACTION_HISTORY, GET_TRANSACTION_ERRORS,
} from "./Types";

export const getTransactionHistory = () => dispatch => {
  console.log("[REDUX] getTransactionHistory")

  axios.get(`/getTransactionHistory`).then(function (response) {
    if (response.data.result) {
      dispatch({
        type: GET_TRANSACTION_HISTORY,
        payload: {
          history: response.data.result.transactions,
          errorCode: response.data.error_code,
          totalCount: response.data.result.total_count
        },
      });
    } else {
      dispatch({
        type: GET_TRANSACTION_ERRORS,
        payload: {
          errorMsg: response.data.error_code,
          status: "ERROR"
        },
      });
    }

  }).catch(function (e) {
    dispatch({
      type: GET_TRANSACTION_ERRORS,
      payload: {
        errorMsg: "Error while requesting for data",
        status: "400"
      },
    });
  });
}

export const getTransactionHistoryByBlock = (block) => dispatch => {
  console.log("[REDUX] getTransactionHistoryByBlock")

  dispatch({
    type: CLEAR_TRANSACTION_HISTORY,
  });

  axios.get(`/getTransactionHistory?ledger_seq=` + block).then(function (response) {
    if (response.data.result != null && response.data.result.total_count > 0) {
      dispatch({
        type: GET_TRANSACTION_HISTORY,
        payload: {
          history: response.data.result.transactions,
          errorCode: response.data.error_code,
          totalCount: response.data.result.total_count
        },
      });
    } else {
      dispatch({
        type: GET_TRANSACTION_ERRORS,
        payload: {
          errorMsg: response.data.error_desc,
          status: response.data.error_code
        },
      });
    }

  }).catch(function (e) {
    dispatch({
      type: GET_TRANSACTION_ERRORS,
      payload: {
        errorMsg: "Error while requesting for data",
        status: "400"
      },
    });
  });
}

export const getTransactionHistoryByAddress = (address) => dispatch => {
  console.log("[REDUX] getTransactionHistoryByAddress")

  dispatch({
    type: CLEAR_TRANSACTION_HISTORY,
  });

  axios.get(`/getTransactionHistory?address=` + address).then(function (response) {
    if (response.data.result != null && response.data.result.total_count > 0) {
      dispatch({
        type: GET_TRANSACTION_HISTORY,
        payload: {
          history: response.data.result.transactions.filter(function (it) {
            return it.transaction.source_address === address || (it.transaction.operations != null && it.transaction.operations.length > 0 && it.transaction.operations[0].pay_coin != null && it.transaction.operations[0].pay_coin.dest_address === address)
          }),
          errorCode: response.data.error_code,
          totalCount: response.data.result.total_count
        },
      });
    } else {
      dispatch({
        type: GET_TRANSACTION_ERRORS,
        payload: {
          errorMsg: response.data.error_desc,
          status: response.data.error_code
        },
      });
    }

  }).catch(function (e) {
    dispatch({
      type: GET_TRANSACTION_ERRORS,
      payload: {
        errorMsg: "Error while requesting for data",
        status: "400"
      },
    });
  });
}

export const getTransactionHistoryByHash = (hash) => dispatch => {
  console.log("[REDUX] getTransactionHistoryByHash")

  dispatch({
    type: CLEAR_TRANSACTION_HISTORY,
  });

  axios.get(`/getTransactionHistory?hash=` + hash).then(function (response) {
    if (response.data.result != null && response.data.result.total_count > 0) {
      dispatch({
        type: GET_TRANSACTION_HISTORY,
        payload: {
          history: response.data.result.transactions,
          errorCode: response.data.error_code,
          totalCount: response.data.result.total_count,
          raw: response.data
        },
      });
    } else {
      dispatch({
        type: GET_TRANSACTION_ERRORS,
        payload: {
          errorMsg: response.data.error_desc,
          status: response.data.error_code
        },
      });
    }

  }).catch(function (e) {
    dispatch({
      type: GET_TRANSACTION_ERRORS,
      payload: {
        errorMsg: "Error while requesting for data",
        status: "400"
      },
    });
  });
}
