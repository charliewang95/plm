import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import {
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow, TableGroupRow,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import RaisedButton from 'material-ui/Button';


const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
  };


var userId;
var sessionId;
var isAdmin;

const ingredientNameGroupCriteria = value => ({ key: value.substr(0, 1) });

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    // var dummyObject = new Object();
    this.state = {
        productRows:(props.location.state) ? [props.location.state.details.IngredientLotUsedInProduct] : [],
        open : true,
        columns:[
          { name: 'ingredientName', title: 'Ingredient Name ' },
          { name: 'vendorName', title: 'Vendor ' },
          { name: 'lotNumber', title: 'Lot Number ' },
        ],
        rows:[],
        // integratedGroupingColumnExtensions: [
        //   { columnName: 'ingredientName', criteria: ingredientNameGroupCriteria },
        // ],
        // tableGroupColumnExtension: [
        //   { columnName: 'ingredientName', showWhenGrouped: true },
        // ],
        grouping: [{ columnName: 'ingredientName' }],
    };

    this.changeGrouping = grouping => this.setState({ grouping });

    this.cancelDetailView =() =>
      this.setState({
        rows:[],
        productRows:[],
        open: false,
      });
    console.log(this.state.productRows);
}

  componentWillMount(){
    // console.log(" Formula Rows " + JSON.stringify(this.state.formulaRows));
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    var rawData = this.state.productRows[0];
    var processedData = [...rawData.map((row, index)=> ({
        id:index,...row,
      })),
    ];
    this.setState({rows: processedData});
  }

  // cancel(){
  //     this.setState({open:false});
  //   }
  // handleOnClose(){
  //   this.setState({open:false});
  // }

  render() {
    const {productRows,rows,columns, grouping} = this.state;
    return (
      <div>
      {/* <p><font size="6">Production Review</font></p> */}
      <Paper>
        {/* <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
        >
          <Table />
          <TableHeaderRow />
        </Grid> */}
      <Divider/>
          <Dialog
            open={this.state.open}
            onClose={this.cancelDetailView}
          >
            <DialogTitle>Product Details</DialogTitle>
            <DialogContent>
              <Paper>
                <Grid
                  rows={this.state.rows}
                  columns={this.state.columns}
                >
                  <GroupingState
                    grouping={grouping}
                  />
                  <IntegratedGrouping/>
                  <Table/>
                  <TableHeaderRow />
                  <TableGroupRow/>
                </Grid>
              </Paper>
              <Divider />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.cancelDetailView}
                color="primary"
                component = {Link} to = "/product"
                >Cancel</Button>
              {/* <Button
                component = {Link} to = "/product"
                onClick={this.productionReview} color="secondary">Add To Production</Button> */}
            </DialogActions>
          </Dialog>
      </Paper>
   </div>
    );
  }
}
export default ProductDetails;
