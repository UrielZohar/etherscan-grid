import React, { useState, useCallback, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import { TextField, Button } from '@material-ui/core';
import {
  SortingState, 
  FilteringState, 
  SearchState,
  IntegratedFiltering,
  IntegratedSorting
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable, 
  TableHeaderRow, 
  TableFilterRow, 
  TableColumnReordering, 
  Toolbar, 
  SearchPanel,
  TableColumnResizing
} from '@devexpress/dx-react-grid-material-ui';

import { Spinner } from '../spinner/Spinner';
import axios from 'axios';
import APIManager from '../../utils/APIManager';
import './TxnsTable.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
  },
}));

const defaultColumnWidths = [
  { columnName: "hash", width: 200 },
  { columnName: "value", width: 200 },
  { columnName: "from", width: 200 },
  { columnName: "to", width: 200 },
  { columnName: "confirmations", width: 200 },
  { columnName: "timeStamp", width: 300 },
];


const Cell = (props) => {
  const { column, value } = props;
  if (column.name === 'from' || column.name === 'to' ) {
    return (<VirtualTable.Cell {...props}>
      <a 
        href={`https://etherscan.io/address/${value}`}
        target="_blank">
        {value}
      </a>
    </VirtualTable.Cell>);
  }
  if (column.name === 'hash') {
    return (<VirtualTable.Cell {...props}>
      <a 
        href={`https://etherscan.io/tx/${value}`}
        target="_blank">
        {value}
      </a>
    </VirtualTable.Cell>);
  }
  if (column.name === 'timeStamp') {
    let date = (new Date(value * 1000)).toLocaleString();
    return (<VirtualTable.Cell {...props}>
      <span>
        {date}
      </span>
    </VirtualTable.Cell>);
  }
  return <VirtualTable.Cell {...props}>
      </VirtualTable.Cell>;
};

const getRowId = row => row.id;

export default () => {
  const addressInput = useRef();
  const classes = useStyles();
  const [errInInput, setErrInInput] = useState(false);
  const [columns] = useState([
    { name: "hash", title: 'Hash' },
    { name: "value", title: 'Value' },
    { name: "from", title: 'From address' },
    { name: "to", title: 'To address' },
    { name: "confirmations", title: 'Confirmations' },
    { name: "timeStamp", title: 'Timestamp' },
  ]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const loadTxnsByAddress = useCallback(() => {
    const address = addressInput.current.value;
    if (!address) {
      setErrInInput(true);
      return;
    } else {
      setErrInInput(false);
      setIsLoading(true);
      axios.get(APIManager.getAllTnxByAddress(address))
      .then(res => {
        let newRows = res.data.result.map(item => ({
          ...item,
          id: item.hash
        }))
        setRows(newRows);
        setIsLoading(false);
      })
      .catch(() => {
        window.alert("Network error");
        setIsLoading(true);
        });
    }

  }, []);

  return (
    <div className={classes.root}>
      {isLoading && (<Spinner />)}
      <div className="load-txns-section">
        <TextField
          inputRef={addressInput}
          error={errInInput}
          placeholder="address">
        </TextField>
        <Button
          onClick={loadTxnsByAddress}
          color="primary" 
          variant="contained"
          className="load-btn">
          Load tnxs by address
        </Button>
      </div>
      <Paper>
        <Grid
          rows={rows}
          columns={columns}
          columnAutoWidth={true}
          getRowId={getRowId}
        >
          <FilteringState
            defaultFilters={[]}
          />
          <SearchState />
          <SortingState
            defaultSorting={[]}
          />
          <IntegratedFiltering />
          <IntegratedSorting />

          <VirtualTable
            cellComponent={Cell}
          />
          <TableHeaderRow showSortingControls />
          <TableColumnReordering defaultOrder={columns.map(column => column.name)} />
          <TableFilterRow showFilterSelector />
          <Toolbar />
          <SearchPanel />
        </Grid>
      </Paper>
    </div>
  );
};
