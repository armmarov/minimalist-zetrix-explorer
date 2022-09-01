import {
  GET_LEDGER_DETAIL, GET_LEDGER_ERRORS
} from "../actions/Types";

const initialState = {
  blockHeight: 0,
  diffTime: 0,
  closeTime: 0,
  txCount: 0,
  version: 0,
  hash: 0,
  prevHash: 0,
  treeHash: 0,
  conValueHash: 0,
  conNodeHash: 0,
  blockReward: 0,
  raw: {}
};

export default function (state = initialState, action) {
  console.log(action)
  switch (action.type) {

    case GET_LEDGER_DETAIL:
      return {
        ...state,
        blockHeight: action.payload.blockHeight,
        closeTime: action.payload.closeTime,
        diffTime: state.closeTime != null ? action.payload.closeTime - state.closeTime : 0,
        txCount: action.payload.txCount,
        version: action.payload.version,
        hash: action.payload.hash,
        prevHash: action.payload.prevHash,
        treeHash: action.payload.treeHash,
        conValueHash: action.payload.conValueHash,
        conNodeHash: action.payload.conNodeHash,
        blockReward: action.payload.blockReward,
        raw: action.payload.raw
      };

    case GET_LEDGER_ERRORS:
      return {
        ...state,
        errMsg: action.payload.errMsg,
        status: action.payload.status
      };

    default:
      return state;
  }
}
