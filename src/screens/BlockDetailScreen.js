import React from "react";
import ErrorCode from '../errors';

//Redux
import {connect} from 'react-redux';
import {getTransactionHistoryByBlock} from "../actions/TransactionActions";
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
import {getLedgerDetailByBlock} from "../actions/LedgerActions";

import {withParams} from "../utils/withParams";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {withRouter} from "../utils/withRouter";
import Typography from "@mui/material/Typography";

const columns = [
  {
    id: 'time',
    label: 'Time',
    format: (value) => moment(new Date(value / 1000)).format('DD/MM/YYYY HH:mm:ss'),
    align: 'center',
  },
  {
    id: 'block', label: 'Block', align: 'center'
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

class BlockDetailScreen extends React.Component {


  constructor(props) {

    super(props);
    console.log("[BlockDetailScreen] constructor")
    console.log(props.params)

    this.blockId = props.params.id;

    this.state = {
      page: 0,
      rowsPerPage: 20,
      rows: [],
      ledger: {
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
        txSize: 0,
        raw: null
      },
      inProgress: false
    }
  }

  componentDidMount() {
    console.log("[BlockDetailScreen] componentDidMount", this.blockId);
    this.props.getTransactionHistoryByBlock(this.blockId);
    this.props.getLedgerDetailByBlock(this.blockId);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[BlockDetailScreen] componentDidUpdate");
    if (prevProps.history !== this.props.history || prevProps.ledger !== this.props.ledger) {
      this.updateHistory()
    }
  }

  updateHistory = async () => {
    this.setState({
      inProgress: true,
    })
    let history = [];
    let txSize = 0;
    let ledger = this.state.ledger;
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

    if (this.props.ledger != null) {
      ledger = {
        blockHeight: this.props.ledger.blockHeight,
        closeTime: this.props.ledger.closeTime,
        txCount: history.length,
        version: this.props.ledger.version,
        hash: this.props.ledger.hash,
        prevHash: this.props.ledger.prevHash,
        treeHash: this.props.ledger.treeHash,
        conValueHash: this.props.ledger.conValueHash,
        conNodeHash: this.props.ledger.conNodeHash,
        blockReward: this.props.ledger.blockReward,
        txSize: txSize,
        raw: this.props.ledger.raw
      }
    }

    this.setState({
      rows: history,
      ledger: ledger,
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
    console.log(header, content);
    if (header === "from") {
      this.props.navigate("/account/" + content);
    } else if (header === "to") {
      this.props.navigate("/account/" + content);
    } else if (header === "txHash") {
      // this.props.history.push("path/to/push");
    }
  };

  copy = async (text) => {
    await navigator.clipboard.writeText(text)
  }

  render() {
    console.log("[BlockDetailScreen] render");
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
                width: '80px',
                display: 'inline-block',
                height: '30px',
                fontWeight: "bold",
                fontSize: "16px",
                paddingTop: "3px"
              }}>BLOCK
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
              }} onClick={() => this.copy(this.blockId)}>{this.blockId}</div>
              <div style={{
                display: 'inline-block',
                height: '50px',
                width: 'auto',
                float: "right"
              }}>

                <KeyboardArrowLeftIcon style={{
                  backgroundColor: "gray",
                  display: "inline-block",
                  width: "40px",
                  borderRadius: "20px",
                  textAlign: "center",
                  marginTop: "3px",
                  marginRight: "20px",
                  cursor: "pointer"
                }} onClick={() => {
                  this.props.navigate("/block/" + (parseInt(this.blockId) - 1).toString());
                  window.location.reload();
                }}/>
                <KeyboardArrowRightIcon style={{
                  backgroundColor: "gray",
                  display: "inline-block",
                  width: "40px",
                  borderRadius: "20px",
                  textAlign: "center",
                  cursor: "pointer"
                }} onClick={() => {
                  this.props.navigate("/block/" + (parseInt(this.blockId) + 1).toString());
                  window.location.reload();
                }}/>
              </div>
            </div>

            <div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Block Reward</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.blockReward} ZTX</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Tx Count</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.txCount}</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Block Height</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.blockHeight}</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Block Size</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.txSize} bytes</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Block Version</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.version} </div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Block Producing Time</div>
                <div style={{
                  display: 'inline-block',
                  height: '30px'
                }}>{moment(new Date(this.state.ledger.closeTime / 1000)).format('DD/MM/YYYY HH:mm:ss')}</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Hash</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.hash}
                  &nbsp;&nbsp;
                  <ContentCopyIcon
                    fontSize={"small"} style={{cursor: "pointer"}}
                    onClick={() => this.copy(this.state.ledger.hash)}></ContentCopyIcon>
                </div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Previous Block Hash</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.prevHash}
                  &nbsp;&nbsp;
                  <ContentCopyIcon
                    fontSize={"small"} style={{cursor: "pointer"}}
                    onClick={() => this.copy(this.state.ledger.prevHash)}></ContentCopyIcon>
                </div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>MerkleTree Hash</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.treeHash}
                  &nbsp;&nbsp;
                  <ContentCopyIcon
                    fontSize={"small"} style={{cursor: "pointer"}}
                    onClick={() => this.copy(this.state.ledger.treeHash)}></ContentCopyIcon>
                </div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Consensus Value Hash</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.conValueHash}
                  &nbsp;&nbsp;
                  <ContentCopyIcon
                    fontSize={"small"} style={{cursor: "pointer"}}
                    onClick={() => this.copy(this.state.ledger.conValueHash)}></ContentCopyIcon>
                </div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Consensus Node Hash</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.ledger.conNodeHash}
                  &nbsp;&nbsp;
                  <ContentCopyIcon
                    fontSize={"small"} style={{cursor: "pointer"}}
                    onClick={() => this.copy(this.state.ledger.conNodeHash)}></ContentCopyIcon>
                </div>
              </div>
            </div>
            <Accordion style={{marginTop: "10px"}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>View Raw JSON</Typography>
              </AccordionSummary>
              <AccordionDetails style={{fontSize: "12px", overflow: "scroll", height: "300px"}}>
                <pre>
                  {this.state.ledger.raw == null ? "" : JSON.stringify(this.state.ledger.raw, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
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
                                           style={{color: column.color, cursor: column.cursor}}>
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
  ledger: state.ledger
});

const mapDispatchToProps = {
  getTransactionHistoryByBlock,
  getLedgerDetailByBlock
};

export default withRouter(withParams(connect(mapStateToProps, mapDispatchToProps)(BlockDetailScreen)));
