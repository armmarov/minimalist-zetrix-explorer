import axios from 'axios';
import {
  GET_LEDGER_DETAIL, GET_LEDGER_ERRORS,
} from "./Types";

export const getLedgerDetail = () => dispatch => {
  console.log("[REDUX] getLedgerDetail")

  axios.get(`/getLedger`).then(function (response) {
    if (response.data.result) {
      dispatch({
        type: GET_LEDGER_DETAIL,
        payload: {
          blockHeight: response.data.result.header.seq,
          closeTime: response.data.result.header.close_time,
          txCount: response.data.result.header.tx_count
        },
      });
    } else {
      dispatch({
        type: GET_LEDGER_ERRORS,
        payload: {
          errorMsg: response.data.error_code,
          status: "ERROR"
        },
      });
    }

  }).catch(function (e) {
    dispatch({
      type: GET_LEDGER_ERRORS,
      payload: {
        errorMsg: "Error while requesting for data",
        status: "400"
      },
    });
  });
}

export const getLedgerDetailByBlock = (block) => dispatch => {
  console.log("[REDUX] getLedgerDetail")

  axios.get(`/getLedger?seq=` + block + "&with_validator=true&with_consvalue=true&with_fee=true").then(function (response) {
    if (response.data.result) {
      dispatch({
        type: GET_LEDGER_DETAIL,
        payload: {
          blockHeight: response.data.result.header.seq,
          closeTime: response.data.result.header.close_time,
          txCount: response.data.result.header.tx_count,
          version: response.data.result.header.version,
          hash: response.data.result.header.hash,
          prevHash: response.data.result.header.previous_hash,
          treeHash: response.data.result.header.account_tree_hash,
          conValueHash: response.data.result.header.consensus_value_hash,
          conNodeHash: response.data.result.header.validators_hash,
          blockReward: response.data.result.block_reward == null ? 0 : response.data.result.block_reward,
          raw: response.data
        },
      });
    } else {
      dispatch({
        type: GET_LEDGER_ERRORS,
        payload: {
          errorMsg: response.data.error_desc,
          status: response.data.error_code
        },
      });
    }

  }).catch(function (e) {
    dispatch({
      type: GET_LEDGER_ERRORS,
      payload: {
        errorMsg: "Error while requesting for data",
        status: "400"
      },
    });
  });
}
