import React from "react";
import ErrorCode from '../errors';

//Redux
import {connect} from 'react-redux';
import {
  getTransactionHistoryByHash
} from "../actions/TransactionActions";
import moment from "moment";
import {
  Accordion, AccordionDetails, AccordionSummary,
  Paper
} from "@mui/material";
import {styled} from '@mui/material/styles';
import SearchAppBar from "../components/custom-appbar";

import {withParams} from "../utils/withParams";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {withRouter} from "../utils/withRouter";
import Typography from "@mui/material/Typography";

const StyledUpperCard = styled(Paper)(({theme}) => ({
  margin: "20px",
  padding: "20px"
}));

class TransactionDetailScreen extends React.Component {


  constructor(props) {

    super(props);
    console.log("[TransactionDetailScreen] constructor")
    console.log(props.params)

    this.txHash = props.params.id;

    this.state = {
      transaction: {},
      raw: {},
      inProgress: false
    }
  }

  componentDidMount() {
    console.log("[TransactionDetailScreen] componentDidMount", this.accountId);
    this.props.getTransactionHistoryByHash(this.txHash);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("[TransactionDetailScreen] componentDidUpdate");
    if (prevProps.history !== this.props.history) {
      this.updateHistory()
    }
  }

  updateHistory = async () => {
    this.setState({
      inProgress: true,
    })
    let _tx = {};
    if (this.props.history != null && this.props.history.length > 0) {
      _tx = this.props.history[0];
      console.log(_tx);
    }

    this.setState({
      transaction: _tx,
      raw: this.props.raw,
      inProgress: false
    });
  }

  copy = async (text) => {
    await navigator.clipboard.writeText(text)
  }

  navigateToAccount = async (accountId) => {
    this.props.navigate("/account/" + accountId);
  }

  generateContentForTransferZTX = () => {

    let srcAddress = this.state.transaction.transaction == null || this.state.transaction.transaction.source_address == null ? "" : this.state.transaction.transaction.source_address;
    let destAddress = this.state.transaction.transaction == null || this.state.transaction.transaction.operations == null || this.state.transaction.transaction.operations.length === 0 || this.state.transaction.transaction.operations[0].pay_coin == null ? "" : this.state.transaction.transaction.operations[0].pay_coin.dest_address
    let amount = this.state.transaction.transaction == null || this.state.transaction.transaction.operations == null || this.state.transaction.transaction.operations.length === 0 || this.state.transaction.transaction.operations[0].pay_coin == null ? 0 : this.state.transaction.transaction.operations[0].pay_coin.amount;
    let metadata = this.state.transaction.transaction == null || this.state.transaction.transaction.operations == null || this.state.transaction.transaction.operations.length === 0 ? "" : this.state.transaction.transaction.operations[0].metadata;
    return <div>
      <div style={{width: '100%', height: '35px'}}>
        <div style={{width: '200px', display: 'inline-block', height: '35px'}}>From Address</div>
        <div style={{
          display: 'inline-block',
          height: '35px'
        }}><span style={{color: "#FAF884", cursor: "pointer"}}
                 onClick={() => this.navigateToAccount(srcAddress)}>{srcAddress}</span> &nbsp;&nbsp;
          <ContentCopyIcon
            fontSize={"small"} style={{cursor: "pointer"}}
            onClick={() => this.copy(srcAddress)}></ContentCopyIcon></div>
      </div>
      <div style={{width: '100%', height: '35px'}}>
        <div style={{width: '200px', display: 'inline-block', height: '35px'}}>To Address</div>
        <div style={{
          display: 'inline-block',
          height: '35px'
        }}><span style={{color: "#FAF884", cursor: "pointer"}}
                 onClick={() => this.navigateToAccount(destAddress)}>{destAddress}</span> &nbsp;&nbsp;
          <ContentCopyIcon
            fontSize={"small"} style={{cursor: "pointer"}}
            onClick={() => this.copy(destAddress)}></ContentCopyIcon>
        </div>
      </div>
      <div style={{width: '100%', height: '35px'}}>
        <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Amount</div>
        <div style={{
          display: 'inline-block',
          height: '35px'
        }}>{amount / 1000000} ZTX
        </div>
      </div>
      {metadata == null || metadata === "" ? <div></div> :
        <div style={{width: '100%', height: '35px'}}>
          <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Metadata</div>
          <div style={{
            display: 'inline-block',
            height: '35px'
          }}>{metadata} &nbsp;&nbsp;
            <ContentCopyIcon
              fontSize={"small"} style={{cursor: "pointer"}}
              onClick={() => this.copy(metadata)}></ContentCopyIcon>
          </div>
        </div>
      }

    </div>;
  }

  generateContentForCallContract = () => {

    let destAddress = this.state.transaction.transaction == null || this.state.transaction.transaction.operations == null || this.state.transaction.transaction.operations.length === 0 ? "" : this.state.transaction.transaction.operations[0].pay_coin.dest_address;
    return <div>
      <div style={{width: '100%', height: '35px'}}>
        <div style={{width: '200px', display: 'inline-block', height: '35px'}}>From Address</div>
        <div style={{
          display: 'inline-block',
          height: '35px'
        }}><span style={{color: "#FAF884", cursor: "pointer"}}
                 onClick={() => this.navigateToAccount(this.state.transaction.transaction.source_address)}>{this.state.transaction.transaction.source_address}</span> &nbsp;&nbsp;
          <ContentCopyIcon
            fontSize={"small"} style={{cursor: "pointer"}}
            onClick={() => this.copy(this.state.transaction.transaction.source_address)}></ContentCopyIcon></div>
      </div>
      <div style={{width: '100%', height: '35px'}}>
        <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Contract Address</div>
        <div style={{
          display: 'inline-block',
          height: '35px'
        }}><span style={{color: "#FAF884", cursor: "pointer"}}
                 onClick={() => this.navigateToAccount(destAddress)}>{destAddress}</span> &nbsp;&nbsp;
          <ContentCopyIcon
            fontSize={"small"} style={{cursor: "pointer"}}
            onClick={() => this.copy(destAddress)}></ContentCopyIcon>
        </div>
      </div>
      <Accordion style={{marginTop: "10px"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Input</Typography>
        </AccordionSummary>
        <AccordionDetails style={{fontSize: "12px", overflow: "scroll", height: "230px"}}>
          {this.state.transaction.transaction.operations == null || this.state.transaction.transaction.operations.length === 0 ? "No inputs" :
            <pre>{JSON.stringify(JSON.parse(this.state.transaction.transaction.operations[0].pay_coin.input), null, 2)} </pre>}
        </AccordionDetails>
      </Accordion>
    </div>;
  }

  generateContentForCreateContract = () => {
    console.log(this.state.transaction.error_desc);
    let contract = this.state.transaction.transaction.operations[0].create_account.contract.payload;
    let contractAddr = JSON.parse(this.state.transaction.error_desc)[0].contract_address;
    return <div>
      <div style={{width: '100%', height: '35px'}}>
        <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Contract Address</div>
        <div style={{
          display: 'inline-block',
          height: '35px'
        }}><span style={{color: "#FAF884", cursor: "pointer"}}
                 onClick={() => this.navigateToAccount(contractAddr)}>{contractAddr}</span> &nbsp;&nbsp;
          <ContentCopyIcon
            fontSize={"small"} style={{cursor: "pointer"}}
            onClick={() => this.copy(contractAddr)}></ContentCopyIcon></div>
      </div>
      <div style={{width: '100%', height: '35px'}}>
        <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Initial Balance</div>
        <div style={{
          display: 'inline-block',
          height: '35px'
        }}>{this.state.transaction.transaction.operations[0].create_account.init_balance / 1000000} ZTX
        </div>
      </div>
      <Accordion style={{marginTop: "10px"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Input</Typography>
        </AccordionSummary>
        <AccordionDetails style={{fontSize: "12px", overflow: "scroll", height: "230px"}}>
          {this.state.transaction.transaction.operations == null || this.state.transaction.transaction.operations.length === 0 ? "No inputs" :
            <pre>{JSON.stringify(JSON.parse(this.state.transaction.transaction.operations[0].create_account.init_input), null, 2)} </pre>}
        </AccordionDetails>
      </Accordion>
      <Accordion style={{marginTop: "10px"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{"View Contract"}</Typography>
        </AccordionSummary>
        <AccordionDetails style={{fontSize: "12px", overflow: "scroll", height: "300px"}}>
                <pre>
                  {contract == null || contract === "" ? "No data" : contract}
                </pre>
        </AccordionDetails>
      </Accordion>
    </div>;
  }


  render() {
    console.log("[TransactionDetailScreen] render");
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
                width: '150px',
                display: 'inline-block',
                height: '30px',
                fontWeight: "bold",
                fontSize: "16px",
                paddingTop: "3px"
              }}>TRANSACTION
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
              }} onClick={() => this.copy(this.txHash)}>{this.txHash}</div>
            </div>

            <div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Time</div>
                <div style={{
                  display: 'inline-block',
                  height: '35px'
                }}>{moment(new Date(this.state.transaction.close_time / 1000)).format('DD/MM/YYYY HH:mm:ss')}</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Block Height</div>
                <div style={{display: 'inline-block', height: '35px'}}>{this.state.transaction.ledger_seq}</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Transaction Status</div>
                <div style={{
                  display: 'inline-block',
                  height: '35px'
                }}>{this.state.transaction.error_code === 0 ? "Success" : "Failed"}</div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Transaction Fee</div>
                <div style={{
                  display: 'inline-block',
                  height: '35px'
                }}>{this.state.transaction.actual_fee == null || this.state.transaction.actual_fee === 0 ? "0" : (this.state.transaction.actual_fee / 1000000)} ZTX
                </div>
              </div>
              <div style={{width: '100%', height: '35px'}}>
                <div style={{width: '200px', display: 'inline-block', height: '35px'}}>Source Address</div>
                <div style={{
                  display: 'inline-block',
                  height: '35px'
                }}><span style={{color: "#FAF884", cursor: "pointer"}}
                         onClick={() => this.navigateToAccount(this.state.transaction.transaction.source_address)}>{this.state.transaction.transaction == null ? "" : this.state.transaction.transaction.source_address}</span>
                  &nbsp;&nbsp;
                  <ContentCopyIcon
                    fontSize={"small"} style={{cursor: "pointer"}}
                    onClick={() => this.copy(this.state.ledger.hash)}></ContentCopyIcon>
                </div>
              </div>
            </div>
            <Accordion style={{marginTop: "10px"}}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Signers</Typography>
              </AccordionSummary>
              <AccordionDetails style={{fontSize: "12px", overflow: "scroll", height: "230px"}}>
                <ol>
                  {this.state.transaction.signatures && this.state.transaction.signatures.map(it => <li>
                    <pre>{JSON.stringify(it, null, 2)} </pre>
                  </li>)}
                </ol>
              </AccordionDetails>
            </Accordion>
          </StyledUpperCard>
        </div>
        <div>
          <StyledUpperCard elevation={3}>
            <div style={{
              width: '100%', height: '30px',
              marginBottom: "20px",
              verticalAlign: "middle"
            }}>
              <div style={{
                width: '110px',
                display: 'inline-block',
                height: '30px',
                fontWeight: "bold",
                fontSize: "16px",
                paddingTop: "3px"
              }}>Operation
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
              }}>{this.state.transaction.contract_tx_hashes != null ? "Call Contract" : this.state.transaction.error_desc != null && this.state.transaction.error_desc.includes("contract_address") ? "Create Contract" : (this.state.transaction.transaction != null && this.state.transaction.transaction.operations != null && this.state.transaction.transaction.operations.length > 0 && this.state.transaction.transaction.operations[0].pay_coin != null) ? "Transfer ZTX" : "Others"}</div>
            </div>

            {this.state.transaction.contract_tx_hashes != null ? this.generateContentForCallContract() : this.state.transaction.error_desc != null && this.state.transaction.error_desc.includes("contract_address") ? this.generateContentForCreateContract() :
              (this.state.transaction.transaction != null && this.state.transaction.transaction.operations != null && this.state.transaction.transaction.operations.length > 0 && this.state.transaction.transaction.operations[0].pay_coin != null) ? this.generateContentForTransferZTX() :
                <div></div>}

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
                  {this.state.raw == null ? "" : JSON.stringify(this.state.raw, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
          </StyledUpperCard>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  history: state.transaction.history,
  errorCode: state.transaction.errorCode,
  totalCount: state.transaction.totalCount,
  raw: state.transaction.raw,
  status: state.transaction.status,
});

const mapDispatchToProps = {
  getTransactionHistoryByHash
};

export default withRouter(withParams(connect(mapStateToProps, mapDispatchToProps)(TransactionDetailScreen)));
