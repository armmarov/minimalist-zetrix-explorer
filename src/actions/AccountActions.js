import axios from 'axios';
import {
  GET_ACCOUNT_INFO,
  GET_ACCOUNT_ERRORS,
} from "./Types";

export const getAccountInfoByAddress = (address) => dispatch => {
  console.log("[REDUX] getAccountInfoByAddress")

  axios.get(`/getAccount?address=` + address).then(function (response) {
    if (response.data.result) {
      dispatch({
        type: GET_ACCOUNT_INFO,
        payload: {
          address: response.data.result.address,
          balance: response.data.result.balance,
          nonce: response.data.result.nonce,
          contract: response.data.result.contract == null ? null : response.data.result.contract.payload,
          metadatas: response.data.result.metadatas == null ? [] : response.data.result.metadatas,
          status: response.data.error_code,
          raw: response.data
        }
      });
    } else {
      dispatch({
        type: GET_ACCOUNT_ERRORS,
        payload: {
          errorMsg: response.data.error_desc,
          status: response.data.error_code
        },
      });
    }

  }).catch(function (e) {
    dispatch({
      type: GET_ACCOUNT_ERRORS,
      payload: {
        errorMsg: "Error while requesting for data",
        status: "400"
      },
    });
  });
}
