import React from "react";
import ErrorCode from '../errors';

//Redux
import {connect} from 'react-redux';
import {getTransactionHistory} from "../actions/TransactionActions";
import moment from "moment";
import {
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
import Statistic from "../components/statistic";
import {getLedgerDetail} from "../actions/LedgerActions";
import {withRouter} from "../utils/withRouter";

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
    color: '#FFE87C'
  },
  {
    id: 'to',
    label: 'To',
    format: (value) => value === "-" ? "-" : value.substring(0, 6) + "......." + value.substring(value.length - 7, value.length),
    align: 'center',
    cursor: 'pointer',
    color: '#FFE87C'
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
    color: '#FFE87C'
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

class Dashboard extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rowsPerPage: 20,
      rows: [],
      seconds: 10,

      ledger: {
        blockHeight: 0,
        closeTime: 0,
        txCount: 0
      },
    }

    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentWillUnmount() {
    console.log("[Dashboard] componentWillUnmount");
    if (this.timer !== 0) {
      clearInterval(this.timer);
    }
  }

  componentDidMount() {
    console.log("[Dashboard] componentDidMount");
    this.props.getTransactionHistory();
    this.props.getLedgerDetail();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[Dashboard] componentDidUpdate");
    if (prevProps.history !== this.props.history) {
      this.updateHistory()
    }
  }

  updateHistory = async () => {
    let history = [];
    let ledger = this.state.ledger;
    if (this.props.history != null && this.props.history.length > 0) {
      this.props.history.forEach((item, index) => {
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

    if (this.props.ledger != null) {
      ledger = this.props.ledger;
    }
    this.setState({
      rows: history,
      ledger: ledger
    });

    if (this.timer === 0) {
      this.startTimer();
    }
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      this.props.getTransactionHistory();
      this.props.getLedgerDetail();
      this.setState({
        seconds: 10
      })
    }
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
    if (content === "-") return;
    console.log(header, content);
    if (header === "block") {
      this.props.navigate("/block/" + content);
    } else if (header === "from") {
      this.props.navigate("/account/" + content);
    } else if (header === "to") {
      this.props.navigate("/account/" + content);
    } else if (header === "txHash") {
      this.props.navigate("/transaction/" + content);
    }
  };

  render() {
    console.log("[Dashboard] render");
    return (
      <div style={{height: "100%", width: "100%"}}>
        <SearchAppBar/>
        <Statistic
          blockHeight={this.state.ledger.blockHeight.toString()}
          txCount={this.state.ledger.txCount.toString()}
          closeTime={this.state.ledger.diffTime == null ? 0 : this.state.ledger.diffTime.toString()}
        />
        {
          this.state.rows.length === 0 ?
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
                          key={column.id + "head"}
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
                                             color: value === "-" ? "white" : column.color,
                                             cursor: value === "-" ? "text" : column.cursor
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
  ledger: state.ledger
});

const mapDispatchToProps = {
  getTransactionHistory,
  getLedgerDetail
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
