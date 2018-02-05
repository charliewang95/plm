import React from 'react';
import Paper from 'material-ui/Paper';
import {
  Grid,
  Table,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import * as testConfig from '../../../resources/testConfig.js';
import * as vendorActions from '../../interface/cartInterface.js';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';

import dummyData from './dummyData.js';


// TODO: Get the user ID
const userId = "5a63be959144b37a6136491e";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'ingredientName', title: 'Ingredient Name' },
        { name: 'quantity', title: 'Quantity' },
      ],
      rows: [],
    };
  }

  componentDidMount(){
    this.loadCartData();
  }

  async loadCartData(){
    var startingIndex = 0;
    var rawData = dummyData;
    if(READ_FROM_DATABASE){
      //TODO: Initialize data
      rawData = await vendorActions.getAllCartsAsync(userId);
    } else {
      rawData = dummyData;
    }
    var processedData = [...rawData.map((row, index)=> ({
        id: startingIndex + index,...row,
      })),
    ];
      console.log("processedData " + JSON.stringify(processedData));
      this.setState({rows:processedData});
  }


  render() {
    const { rows, columns } = this.state;
    return (

      <Paper>
        {/*<Typography type="headline" component="h3">
          Cart
        </Typography>*/}
      <Divider/>
        <Grid
          rows={rows}
          columns={columns}
        >
          <Table />
          <TableHeaderRow />
        </Grid>
      </Paper>
    );
  }
}

export default Cart;
