import {combineReducers} from 'redux';
import UserReducers from './UserReducers';
import TransactionReducers from "./TransactionReducers";
import LedgerReducers from "./LedgerReducers";
import AccountReducers from "./AccountReducers";

export default combineReducers({
  users: UserReducers,
  transaction: TransactionReducers,
  ledger: LedgerReducers,
  account: AccountReducers
});
