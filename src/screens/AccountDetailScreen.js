import React from "react";
import ErrorCode from '../errors';

//Redux
import {connect} from 'react-redux';
import {
  getTransactionHistoryByAddress,
} from "../actions/TransactionActions";
import moment from "moment";
import {
  Accordion, AccordionDetails, AccordionSummary,
  Paper, Skeleton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from "@mui/material";
import {styled} from '@mui/material/styles';
import SearchAppBar from "../components/custom-appbar";

import {withParams} from "../utils/withParams";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {withRouter} from "../utils/withRouter";
import Typography from "@mui/material/Typography";
import {getAccountInfoByAddress} from "../actions/AccountActions";

const columns = [
  {
    id: 'time',
    label: 'Time',
    format: (value) => moment(new Date(value / 1000)).format('DD/MM/YYYY HH:mm:ss'),
    align: 'center',
  },
  {
    id: 'block', label: 'Block', align: 'center', cursor: 'pointer',
    color: '#FFE87C'
  },
  {
    id: 'txType',
    label: 'TX Type',
    minWidth: 100,
    align: 'center',

  },
  {
    id: 'from',
    label: 'From',
    format: (value) => value.substring(0, 6) + "......." + value.substring(value.length - 7, value.length),
    align: 'center',
    cursor: 'pointer',
    color: '#FAF884'
  },
  {
    id: 'to',
    label: 'To',
    format: (value) => value === "-" ? "-" : value.substring(0, 6) + "......." + value.substring(value.length - 7, value.length),
    align: 'center',
    cursor: 'pointer',
    color: '#FAF884'
  },
  {
    id: 'value',
    label: 'Value',
    align: 'center',
  },
  {
    id: 'txHash',
    label: 'TX Hash',
    format: (value) => value.substring(0, 10) + "......." + value.substring(value.length - 7, value.length),
    align: 'center',
    cursor: 'pointer',
    color: '#FAF884'
  },
  {
    id: 'status',
    label: 'Status',
    align: 'center',
  },
];

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledUpperCard = styled(Paper)(({theme}) => ({
  margin: "20px",
  padding: "20px"
}));

class AccountDetailScreen extends React.Component {


  constructor(props) {

    super(props);
    console.log("[AccountDetailScreen] constructor")
    console.log(props.params)

    this.accountId = props.params.id;

    this.state = {
      page: 0,
      rowsPerPage: 20,
      rows: [],
      account: {
        address: 0,
        balance: 0,
        nonce: 0,
        contract: "",
        metadatas: [],
        raw: null
      },
      inProgress: false
    }
  }

  componentDidMount() {
    console.log("[AccountDetailScreen] componentDidMount", this.accountId);
    this.props.getTransactionHistoryByAddress(this.accountId);
    this.props.getAccountInfoByAddress(this.accountId);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[AccountDetailScreen] componentDidUpdate");
    if (prevProps.history !== this.props.history || prevProps.account !== this.props.account) {
      this.updateHistory()
    }
  }

  updateHistory = async () => {
    this.setState({
      inProgress: true,
    })
    let history = [];
    let txSize = 0;
    let account = this.state.account;
    if (this.props.history != null && this.props.history.length > 0) {
      this.props.history.forEach((item, index) => {
        txSize += item.tx_size;
        history.push(this.createData(
          item.close_time,
          item.ledger_seq,
          item.signatures == null ? "ACCOUNT" : "CONSENSUS",
          item.transaction.source_address,
          item.transaction.operations == null || item.transaction.operations.length === 0 || item.transaction.operations[0].pay_coin == null || item.transaction.operations[0].pay_coin.dest_address == null ? "-" : item.transaction.operations[0].pay_coin.dest_address,
          item.transaction.operations == null || item.transaction.operations.length === 0 || item.transaction.operations[0].pay_coin == null || item.transaction.operations[0].pay_coin.dest_address == null || item.transaction.operations[0].pay_coin.amount == null ? "0 ZTX" : ((item.transaction.operations[0].pay_coin.amount / 1000000) + " ZTX"),
          item.hash,
          item.error_code === 0 ? "Success" : "Failed"))
      })
      console.log(history);
    }

    if (this.props.account != null) {
      account = {
        address: this.props.account.address,
        balance: this.props.account.balance,
        nonce: this.props.account.nonce,
        contract: this.props.account.contract,
        metadatas: this.processMetadata(this.props.account.metadatas),
        raw: this.props.account.raw
      }
    }

    this.setState({
      rows: history,
      account: account,
      inProgress: false
    });
  }

  createData = (time, block, txType, from, to, value, txHash, status) => {
    return {time, block, txType, from, to, value, txHash, status};
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage
    })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0
    })
  };

  tableCellClickHandler = (header, content) => {
    if (content === this.accountId || content === "-") return;
    console.log(header, content);
    if (header === "block") {
      this.props.navigate("/block/" + content);
    } else if (header === "from") {
      this.props.navigate("/account/" + content);
      window.location.reload();
    } else if (header === "to") {
      this.props.navigate("/account/" + content);
      window.location.reload();
    } else if (header === "txHash") {
      // this.props.history.push("path/to/push");
    }
  };

  copy = async (text) => {
    await navigator.clipboard.writeText(text)
  }

  processMetadata = (metadatas) => {
    let items = [];
    for (let i = 0; i < metadatas.length; i++) {
      let item = {
        key: metadatas[i].key,
        value: JSON.parse(metadatas[i].value)
      }
      items.push(item)
    }
    console.log(items);
    return items;
  }


  render() {
    console.log("[AccountDetailScreen] render");
    return (
      <div style={{height: "100%", width: "100%"}}>
        <SearchAppBar/>
        <div>
          <StyledUpperCard elevation={3}>
            <div style={{
              width: '100%', height: '30px',
              marginBottom: "20px",
              verticalAlign: "middle"
            }}>
              <div style={{
                width: '100px',
                display: 'inline-block',
                height: '30px',
                fontWeight: "bold",
                fontSize: "16px",
                paddingTop: "3px"
              }}>ACCOUNT
              </div>
              <div style={{
                display: 'inline-block',
                height: '30px',
                backgroundColor: "#696969",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "16px",
                paddingTop: "3px",
                paddingLeft: "10px",
                paddingRight: "10px",
                cursor: "pointer"
              }} onClick={() => this.copy(this.accountId)}>{this.accountId}</div>
            </div>

            <div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Balance</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.account.balance / 1000000} ZTX</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Nonce</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.account.nonce}</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Account Type</div>
                <div style={{
                  display: 'inline-block',
                  height: '35px'
                }}>{this.state.account.contract == null || this.state.account.contract === "" ? "Normal Account" : "Contract Account"}</div>
              </div>
            </div>
            <Accordion style={{marginTop: "10px"}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{this.state.account.contract == null || this.state.account.contract === "" ? "View Raw JSON" : "View Contract"}</Typography>
              </AccordionSummary>
              <AccordionDetails style={{fontSize: "12px", overflow: "scroll", height: "300px"}}>
                <pre>
                  {this.state.account.contract == null || this.state.account.contract === "" ? (this.state.account.raw == null ? "" : JSON.stringify(this.state.account.raw, null, 2)) : this.state.account.contract}
                </pre>
              </AccordionDetails>
            </Accordion>
            {this.state.account.metadatas == null || this.state.account.metadatas.length === 0 ? <div></div> :
              <Accordion style={{marginTop: "10px"}}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>View Metadatas</Typography>
                </AccordionSummary>
                <AccordionDetails style={{fontSize: "12px", overflow: "scroll", height: "300px"}}>
                  <ol>
                    {this.state.account.metadatas.map(it => <li>
                      <pre>{JSON.stringify(it, null, 2)} </pre>
                    </li>)}
                  </ol>
                </AccordionDetails>
              </Accordion>
            }


          </StyledUpperCard>
        </div>
        {
          this.state.inProgress ?
            <div style={{margin: '50px'}}>
              <Skeleton/>
              <Skeleton animation="wave"/>
              <Skeleton animation={false}/>
            </div> :
            <Paper sx={{width: '100%', overflow: 'hidden'}}>
              <TableContainer sx={{maxHeight: 600}}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <StyledTableRow>
                      {columns.map((column) => (
                        <StyledTableCell
                          key={column.id}
                          align={column.align}
                          style={{minWidth: column.minWidth}}
                        >
                          {column.label}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.rows != null && this.state.rows
                      .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                      .map((row) => {
                        return (
                          <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            {columns.map((column) => {
                              const value = row[column.id];
                              return (
                                <TableCell key={column.id + "cell"} align={column.align}
                                           onClick={() => this.tableCellClickHandler(column.id, value)}
                                           style={{
                                             color: value === this.accountId || value === "-" ? "white" : column.color,
                                             cursor: value === this.accountId || value === "-" ? "text" : column.cursor
                                           }}>
                                  {column.format
                                    ? column.format(value)
                                    : value}
                                </TableCell>
                              );
                            })}
                          </StyledTableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={this.state.rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onPageChange={this.handleChangePage}
                onRowsPerPageChange={this.handleChangeRowsPerPage}
              />
            </Paper>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  history: state.transaction.history,
  errorCode: state.transaction.errorCode,
  totalCount: state.transaction.totalCount,
  status: state.transaction.status,
  account: state.account
});

const mapDispatchToProps = {
  getTransactionHistoryByAddress,
  getAccountInfoByAddress
};

export default withRouter(withParams(connect(mapStateToProps, mapDispatchToProps)(AccountDetailScreen)));
