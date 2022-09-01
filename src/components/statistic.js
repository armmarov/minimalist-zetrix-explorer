import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import moment from "moment/moment";

const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  margin: "20px"
}));

const StatisticTitle = styled('div')(({theme}) => ({
  color: "gray",
  fontSize: "17px"
}));

const StatisticValue = styled('div')(({theme}) => ({
  color: "white",
  fontWeight: "bold",
  fontSize: "25px"
}));

export default function Statistic(props) {
  return (
    <Box sx={{flexGrow: 1}}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Item>
            <StatisticTitle>BLOCK HEIGHT</StatisticTitle>
            <StatisticValue>{props.blockHeight}</StatisticValue>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <StatisticTitle>TRANSACTIONS</StatisticTitle>
            <StatisticValue>{props.txCount}</StatisticValue>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <StatisticTitle>LAST BLOCK TIME</StatisticTitle>
            <StatisticValue>{moment(new Date(props.closeTime / 1000)).format('ss')}s</StatisticValue>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
