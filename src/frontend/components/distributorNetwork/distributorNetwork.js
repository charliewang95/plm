import * as React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  TableEditColumn,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import Divider from 'material-ui/Divider';


import {DeleteButton,EditButton,CancelButton,CommitButton} from '../vendors/Buttons.js';
import { Redirect } from 'react-router';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import testData from './testData.js';
import * as distributorNetworkActions from '../../interface/distributorNetworkInterface.js';



var userId;
var sessionId;
var isAdmin;
var isManager;


export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'productName', title: 'Product Name' },
        // { name: 'numUnit', title: 'Total Quantity' },
        { name: 'numUnsold', title: 'Quantity Unsold' },
        { name: 'quantityToSell', title: ' Sale Quantity' },
        { name: 'unitPrice', title: 'Unit Price ($)' },
        { name: 'totalRevenue', title: 'Revenue ($)' },
      ],
      fireRedirect:false,
      rows: [],
      selection: [],
      pageSizes: [20, 50, 200, 500],
      currentPage:0,
      pageSize:20,
      selectedRows:[],
      currentRowSelected:{},
      quantity:'',
      unitPrice:'',
      review:false,
      grandTotalRevenue:0,
    };

    this.changeSelection = selection => {
      console.log("selection");
      console.log(selection);
      var temp = this;

      if(selection.length!=0){
        let {rows} = temp.state;

        var selectedRows = rows.filter(row => selection.indexOf(row.id) > -1);
        console.log(selectedRows);

        if(selectedRows && selectedRows.length >= temp.state.selectedRows.length){
          console.log("second loop");
          var lastSelectedId= selection[selection.length-1];
          console.log(lastSelectedId);
          var currentRowSelected = rows.filter(row => row.id )

          console.log(lastSelectedId);
          var lastSelectedRow = rows.filter(row => row.id ==lastSelectedId);

          temp.setState({currentRowSelected:lastSelectedRow[0]});
          temp.setState({selectedRows:selectedRows});
        }
      }else{
        console.log(selectedRows);
        temp.setState({selectedRows:[]});
      }
      temp.setState({ selection });
    }

    this.changeCurrentPage = currentPage => {
      this.setState({ currentPage });
    };
    this.changePageSize = pageSize => this.setState({ pageSize });


    this.cancelSelection = () => {
      console.log("cancelSelection");
      var temp = this;
      var selectedRows = temp.state.selectedRows;
      var currentRowSelected = temp.state.currentRowSelected;
      let {rows} = temp.state;
      // var leftRows = rows.filter(row => row.id != currentRowSelected.id);

      // temp.setState({selectedRows:leftRows});
      temp.setState({currentRowSelected:{}});
      temp.setState({quantity:''});
      temp.setState({unitPrice:''});

    }
    this.loadDistributorNetworkData = this.loadDistributorNetworkData.bind(this);
    this.updateUnitPrice = this.updateUnitPrice.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.checkSelectionValid = this.checkSelectionValid.bind(this);
    this.sellProducts = this.sellProducts.bind(this);
    this.cancelSale = this.cancelSale.bind(this);
    this.quantitySaveValid = this.quantitySaveValid.bind(this);

    this.updatePriceQtyTable = () => {
      console.log("update price qty in table");
      var temp = this;
      var rowId = temp.state.currentRowSelected.id;
      const rows = temp.state.rows.slice();

      console.log(rowId);
      console.log(rows);
      console.log(temp.state.unitPrice);
      console.log(temp.state.quantity);

      var grandTotalRev = 0;
      for(var i =0; i < rows.length;i++){
        console.log(rows[i].id);
        if(rows[i].id == rowId){
          rows[i].unitPrice = temp.state.unitPrice;
          rows[i].quantityToSell = temp.state.quantity;
          rows[i].totalRevenue = Math.round(temp.state.quantity * temp.state.unitPrice *100)/100;
          grandTotalRev+=rows[i].totalRevenue;

          console.log("inside");
          console.log(rows[i].unitPrice);
          console.log(rows[i].quantityToSell);
        }
      }
      console.log(rows);

      temp.setState({quantity:''});
      temp.setState({unitPrice:''});
      temp.setState({currentRowSelected:{}});
      temp.setState({rows:rows});

      temp.setState({grandTotalRevenue:grandTotalRev});
    }

  }


  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    this.loadDistributorNetworkData();
  }

  async loadDistributorNetworkData(){
    var data = await distributorNetworkActions.getAllDistributorNetworksAsync(sessionId);
    console.log("load distribution network data");
    var processedData = [...data.map((row, index)=> ({
        id:index,...row,
        numUnsold:Math.round((row.numUnit-row.numSold)*100)/100,
        })),
      ];
    this.setState({rows:processedData});
  }

  updateQuantity(event){
    event.preventDefault();
    console.log("update quantity");
    var temp = this;
    // TODO: Fix this
    var re = /^\d*[1-9]\d*$/;
    var unsoldQty = temp.state.currentRowSelected.numUnsold;
    var quantity = event.target.value;
    if(quantity > unsoldQty){
      alert("sale quantity cannot be higher than the unsold quantity!");
    }else if (quantity == '' || (quantity>0 && re.test(event.target.value))){
      temp.setState({quantity: event.target.value});
    }else{
       alert("Quantity must be a positive integer!");
    }
  };

  updateUnitPrice(event){
    event.preventDefault();
    console.log("updateUnitPrice");
    var temp = this;
    const re =  /^\d{0,10}(\.\d{0,2})?$/;
    if (event.target.value == '' || (event.target.value>0 && re.test(event.target.value))) {
       temp.setState({unitPrice: event.target.value})
    }else{
      alert(" unit price must be a positive number.");
    }
  }

  quantitySaveValid(){
    console.log("check if save quantity valid");
    var temp = this;

    var quantity = temp.state.quantity;
    var unitPrice = temp.state.unitPrice;

    if(quantity && unitPrice){
      if(unitPrice == 0 || unitPrice == 0 || quantity == '' || unitPrice == ''){
        console.log("null value ");
        return false;
      }else{
        return true;
      }
    }
    return false;
  }

  checkSelectionValid(){
    console.log("check sell Valid");
    var temp = this;
    var selectedRows  = this.state.selectedRows;
    if(selectedRows.length > 0 ){
      console.log(selectedRows);
      for(var i =0; i < selectedRows.length;i++){
        if(selectedRows[i].quantityToSell <= 0 || selectedRows[i].unitPrice <=0){
          return false;
        }
      }
      return true;
    }else{
      return false;
    }
  }

  cancelSale(){
    console.log("cancel sell");
    console.log(this.state.selection);
    console.log(this.state.selectedRows);
    this.setState({review:false});
  }

  async sellProducts(){
    console.log("sell products");
    console.log(this.state.selectedRows);
    var selectedRows = this.state.selectedRows;

    // var temp = this;
    var products = [];
    for(var i =0; i < this.state.selectedRows;i++){
      var productObject = new Object();
      productObject.productName = selectedRows[i].productName;
      productObject.totalRevenue = selectedRows[i].totalRevenue;
      productObject.quantity = selectedRows[i].quantityToSell;
      products.push(productObject);
    }
      // (products, sessionId, callback)
      await distributorNetworkActions.sellItemsAsync(products,sessionId,function(res){
        if(res.status){
          alert(res.data);
        }else{
          //TODO: SnackBar
        }
      });
    this.setState({review:false});
    this.setState({currentRowSelected:{}});
    this.setState({selectedRows:[]});
    this.setState({selection:[]});
    //TODO: Reload here to get the updated value from backend

    window.location.reload();

  }

  render() {
    const { rows, columns, selection,pageSizes,currentPage ,pageSize,
      fireRedirect,selectedRows,currentRowSelected,
      quantity,unitPrice,grandTotalRevenue} = this.state;

    return (
      <div>
        <span>Total revenue: {grandTotalRevenue}</span>
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
          >
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            <SelectionState
              selection={selection}
              onSelectionChange={this.changeSelection}
            />
            <IntegratedPaging />
            <IntegratedSelection />
            <Table />
            <TableHeaderRow />
            <TableSelection/>
            <PagingPanel
              pageSizes={pageSizes}
            />
          </Grid>
          <Dialog
            open={(currentRowSelected) ? Object.keys(currentRowSelected).length!=0 : false}
            onClose={this.cancelSelection}
            // classes={{ paper: classes.dialog }}
          >
            <DialogTitle>Edit Quantity and unit Price </DialogTitle>
            <DialogContent>
              {/* <DialogContentText>
                Are you sure to remove this product from the sale?
              </DialogContentText> */}
              <Paper
                style = {{backgroundColor:'aliceblue'}}>
                <Grid
                  rows={[currentRowSelected]}
                  columns={columns}

                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
              <Divider/>
              <Paper>
                <TextField
                  required
                  margin="dense"
                  id="quantity"
                  label="Enter Quantity"
                  value = {quantity}
                  fullWidth = {false}
                  onChange={(event) => this.updateQuantity(event)}
                  // verticalSpacing= "desnse"
                  style={{
                  marginLeft: 20,
                  martginRight: 20
                  }}/>

                  <TextField
                    required
                    margin="dense"
                    id="unitPrice"
                    label="Enter Unit Price"
                    value = {unitPrice}
                    fullWidth = {false}
                    onChange={(event) => this.updateUnitPrice(event)}
                    // verticalSpacing= "desnse"
                    style={{
                    marginLeft: 20,
                    martginRight: 20
                    }}/>
              </Paper>

            </DialogContent>
            <DialogActions>
              <Button onClick={this.cancelSelection} color="secondary">Cancel</Button>
              <Button
                disabled = {!this.quantitySaveValid()}
                onClick={this.updatePriceQtyTable} color="primary">SAVE</Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.review}
            onClose={this.cancelSale}
            // classes={{ paper: classes.dialog }}
          >
            <DialogTitle>Sell products </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to sell the selected products?
              </DialogContentText>
              <Paper>
                <Grid
                  rows={selectedRows}
                  columns={columns}
                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.cancelSale} color="primary">Cancel</Button>
              <Button onClick={this.sellProducts} color="secondary">Sell</Button>
            </DialogActions>
          </Dialog>
          <Button raised
                color="primary"
                disabled = {!this.checkSelectionValid()}
                style = {{marginLeft: 550, marginBottom: 30}}
                onClick = {(event) => this.setState({review:true})}
                primary="true">Sell</Button>
        </Paper>
      </div>
    );
  }
}
