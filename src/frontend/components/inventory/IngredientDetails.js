
import React from 'react';
import ingredientActions from '../../interface/ingredientInterface;
import * as testConfig from '../../../resources/testConfig.js'
import {
  Grid,
  Table,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

const sessionId = testConfig.sessionId;

const RowDetail = ({ row }) => (
  console.log("row" + row.ingredientName),
  // TODO: Call the ingredient interface to get details for the ingredient

  <div>Details for {row.ingredientName} from {row.temperatureZone}</div>
);

const IngredientDetail  = ({row})=>(
  console.log("Details for " + row.ingredientName + " " + row.ingredientId),

  // TODO: load ingredient details from the backend
  var ingredientDetails = ingredientActions.getIngredientAsync(row.ingredientId,sessionId),
  var vendorString = ""
  var rows = ingredientDetails.vendors,
  var columns = [
    { name: 'code', title: 'Vendor' },
    { name: 'price', title: 'Price' },
  ],
  <div>Details for {row.ingredientName} </div>
    <Grid
      rows={rows}
      columns={columns}
      >
      <Table />
      <TableHeaderRow />
    </Grid>
);

export default IngredientDetail;
