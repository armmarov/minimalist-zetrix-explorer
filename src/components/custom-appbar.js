import * as React from 'react';
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";

const Search = styled('div')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '400px',
  },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '38ch',
      '&:focus': {
        width: '38ch',
      },
    },
  },
}));

export default function SearchAppBar() {
  const navigate = useNavigate();

  const keyPress = (e) => {
    if (e.key === "Enter") {
      console.log('value', e.target.value);
      const val = e.target.value;

      if (val.length < 7) {
        // Block height
        navigate("/block/" + val);
      } else if (val.length === 37) {
        navigate("/account/" + val);
      } else if (val.length === 64) {
        navigate("/transaction/" + val);
      }
      window.location.reload();
    }
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <img src="/logo.svg" width={120} alt="image" style={{cursor: 'pointer'}} onClick={() => {
            navigate('/')
          }}/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{flexGrow: 1, display: {xs: 'none', sm: 'block'}, cursor: 'pointer', marginLeft: "25px"}}
            onClick={() => {
              navigate('/')
            }}
          >
            CrossChain Platform
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Block, tx hash, addr"
              inputProps={{'aria-label': 'search'}}
              onKeyPress={keyPress}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
