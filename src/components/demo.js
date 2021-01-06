import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { Input, Button } from '@material-ui/core';
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

import { Spinner } from './spinner/Spinner';
import axios from 'axios';
import APIManager from '../utils/APIManager';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
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
  const classes = useStyles();
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
  useEffect(() => {
    setIsLoading(true);
    axios.get(APIManager.getAllTnxByAddress('0x9f7dd5ea934d188a599567ee104e97fa46cb4496'))
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
      })
  }, []);

  return (
    <div className={classes.root}>
      {isLoading && (<Spinner />)}
      <Paper>
        <Input></Input>
        <Button color="primary" variant="contained">
          Load tnxs by address
        </Button>
        <Grid
          rows={rows}
          columns={columns}
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

          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} /> 
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
