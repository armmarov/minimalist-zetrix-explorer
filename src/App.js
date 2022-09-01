import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./screens/Dashboard";

// React-socks
import {BreakpointProvider} from 'react-socks';

// Redux
import store from './store';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {Provider} from "react-redux";
import BlockDetailScreen from "./screens/BlockDetailScreen";
import AccountDetailScreen from "./screens/AccountDetailScreen";
import TransactionDetailScreen from "./screens/TransactionDetailScreen";

const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  },
);


function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <BreakpointProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/block/:id" element={<BlockDetailScreen/>}/>
              <Route path="/account/:id" element={<AccountDetailScreen/>}/>
              <Route path="/transaction/:id" element={<TransactionDetailScreen/>}/>
            </Routes>
          </BrowserRouter>
        </BreakpointProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
