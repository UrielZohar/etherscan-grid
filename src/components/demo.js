import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState, SelectionState, FilteringState, GroupingState, SearchState,
  IntegratedFiltering, IntegratedGrouping, IntegratedSorting, IntegratedSelection,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  VirtualTable, TableHeaderRow, TableFilterRow, TableSelection, TableGroupRow,
  GroupingPanel, DragDropProvider, TableColumnReordering, Toolbar, SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';


import { ProgressBarCell } from './theme-sources/material-ui/components/progress-bar-cell';
import { HighlightedCell } from './theme-sources/material-ui/components/highlighted-cell';
import { CurrencyTypeProvider } from './theme-sources/material-ui/components/currency-type-provider';
import { PercentTypeProvider } from './theme-sources/material-ui/components/percent-type-provider';
import { BooleanTypeProvider } from './theme-sources/material-ui/components/boolean-type-provider';

import {
  generateRows,
  globalSalesValues,
} from './demo-data/generator'; 

import { Spinner } from './spinner/Spinner';
import axios from 'axios';
import APIManager from '../utils/APIManager';

const Cell = (props) => {
  const { column } = props;
  if (column.name === 'discount') {
    return <ProgressBarCell {...props} />;
  }
  if (column.name === 'amount') {
    return <HighlightedCell {...props} />;
  }
  return <VirtualTable.Cell {...props} />;
};

const getRowId = row => row.id;

export default () => {
  /*
  - timestamp: timeStamp
	- from address: from
	- to address: to
	- value: value
	- confirmations: confirmations
  - hash: hash
  */
  console.log("Called");
  const [columns] = useState([
    { name: "hash", title: 'Hash' },
    { name: "value", title: 'Value' },
    { name: "from", title: 'From address' },
    { name: "to", title: 'To address' },
    { name: "confirmations", title: 'Confirmations' },
    { name: "timeStamp", title: 'Timestamp' },
  ]);
  const [rows, setRows] = useState([{
    "id": 0,
    "timeStamp":"1494856341",
    "hash":"0xcdff1c89da4627911280fce6e2693920070fb389e17c21aa5d3bb60fb1d412c9",
    "from":"0x9af152297acfdad5ff9bdc53ef3105efc33e2070",
    "to":"0x9f7dd5ea934d188a599567ee104e97fa46cb4496",
    "value":"54406960000000000",
    "confirmations":"7889487"}
  ]);
  const [tableColumnExtensions] = useState([
    { columnName: 'amount', align: 'right' },
    { columnName: 'units', align: 'right' },
  ]);
  const [currencyColumns] = useState(['amount']);
  const [percentColumns] = useState(['discount']);
  const [booleanColumns] = useState(['shipped']);
  

  return (
    <React.Fragment>
      <h1>{rows.length}</h1>
      <Paper>
        <Grid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <FilteringState
            defaultFilters={[{ columnName: 'saleDate', value: '2016-02' }]}
          />
          <SearchState />
          <SortingState
            defaultSorting={[
              { columnName: 'product', direction: 'asc' },
              { columnName: 'saleDate', direction: 'asc' },
            ]}
          />
          <SelectionState />

          <IntegratedFiltering />
          <IntegratedSorting />
          <IntegratedSelection />

          <CurrencyTypeProvider for={currencyColumns} />
          <PercentTypeProvider for={percentColumns} />
          <BooleanTypeProvider for={booleanColumns} />

          <VirtualTable
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />
          <TableHeaderRow showSortingControls />
          <TableColumnReordering defaultOrder={columns.map(column => column.name)} />
          <TableFilterRow showFilterSelector />
          <TableSelection showSelectAll />
          <Toolbar />
          <SearchPanel />
        </Grid>
      </Paper>
    </React.Fragment>
  );
};
