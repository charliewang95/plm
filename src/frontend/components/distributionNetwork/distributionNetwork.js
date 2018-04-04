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


import {DeleteButton,EditButton,CancelButton,CommitButton} from '../vendors/Buttons.js';
import { Redirect } from 'react-router';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import SellProductsReview from './sellProductsReview.js';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import testData from './testData.js'



var userId;
var sessionId;
var isAdmin;
var isManager;

const Cell = (props)=>{
  return <Table.Cell {...props}/>
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  if(props.column.name == 'numSold' || props.column.name == 'unitPrice'){
    return <TableEditRow.Cell {...props}
            required style={{backgroundColor:'aliceblue'}}
          />;
    }else{
      return <Cell {...props} style={{backgroundColor:'aliceblue'}}  />;
  };
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const commandComponents = {
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];;
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};

Command.propTypes = {
  id: PropTypes.string.isRequired,
  onExecute: PropTypes.func.isRequired,
};


export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'productName', title: 'Product Name' },
        // { name: 'numUnit', title: 'Total Quantity' },
        { name: 'numUnsold', title: 'Unsold Quantity' },
        { name: 'numSold', title: 'Sale Quantity' },
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
      rowChanges: {},
      editingRowIds: [],
      deletingRows:[],
      currentRowSelected:{},
      quantity:'',
      unitPrice:'',
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
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });

    this.commitChanges =  ({ deleted }) => {
      let { rows } = this.state;
      var temp = this;

      // if(changed){
      //     for(var i = 0; i < rows.length;i++){
      //       if(changed[rows[i].id]){
      //         if(changed[rows[i].id].numSold){
      //           var quantity = (changed[rows[i].id].numSold);
      //
      //           var re = /^\d*[1-9]\d*$/;
      //           if(quantity > rows[i].numUnsold){
      //             alert("sale quantity cannot be higher than the unsold quantity!");
      //           }else if (quantity==0 || !(quantity>0 && re.test(quantity))){
      //             alert("sale quantity must be a positive integer.");
      //           }else{
      //             //TODO: Change it to snackbar
      //             console.log(quantity);
      //             console.log(unitPrice);
      //             rows[i].numSold = quantity;
      //             rows[i].totalRevenue = quantity * rows[i].unitPrice;
      //             // alert("successfully changed quantity!");
      //           }
      //         }
      //
      //          if (changed[rows[i].id].unitPrice){
      //            console.log("changed UnitPrice");
      //            console.log(changed[rows[i].id].unitPrice);
      //            var unitPrice = (changed[rows[i].id].unitPrice);
      //
      //            const re = /^\d{0,10}(\.\d{0,2})?$/;
      //
      //            if (unitPrice==0 || !(unitPrice>0 && re.test(unitPrice))){
      //              // alert("sale quantity must be a positive number.");
      //            }else{
      //              //TODO: Change it to snackbar
      //              // alert("successfully changed unit Price!");
      //              console.log(unitPrice);
      //              console.log(rows[i].numSold);
      //              console.log(rows[i].numSold * unitPrice);
      //              rows[i].unitPrice = unitPrice;
      //              rows[i].totalRevenue = Math.round(rows[i].numSold * unitPrice)*100/100;
      //            }
      //         }
      //       }
      //     }
      //   }
        // Delete
        this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
        // TODO: Add SnackBar
    }

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    // this.deleteRows = () => {
    //   var temp = this;
    //   const rows = temp.state.rows.slice();
    //   temp.state.deletingRows.forEach((rowId) => {
    //     const index = rows.findIndex(row => row.id === rowId);
    //     if (index > -1) {
    //       var orderId = rows[index]._id;
    //       // TODO: update back End
    //       rows.splice(index, 1);
    //       // TODO: Add SnackBar
    //       // alert(" Ingredient successfully deleted ! ");
    //     }
    //   });
    //   temp.setState({rows:rows});
    //   temp.setState({ deletingRows: [] });
    // };


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
    this.loadDistributionNetworkData = this.loadDistributionNetworkData.bind(this);
    this.reviewProductsToSell = this.reviewProductsToSell.bind(this);
    this.updateUnitPrice = this.updateUnitPrice.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.checkSelectionValid = this.checkSelectionValid.bind(this);

    this.updatePriceQtyTable = () => {
      console.log("update price qty in table");
      var temp = this;
      var rowId = temp.state.currentRowSelected.id;
      const rows = temp.state.rows.slice();

      console.log(rowId);
      console.log(rows);
      console.log(temp.state.unitPrice);
      console.log(temp.state.quantity);

      for(var i =0; i < rows.length;i++){
        console.log(rows[i].id);
        if(rows[i].id == rowId){
          rows[i].unitPrice = temp.state.unitPrice;
          rows[i].numSold = temp.state.quantity;
          rows[i].totalRevenue = Math.round(temp.state.quantity * temp.state.unitPrice) *100/100;
          console.log("inside");
          console.log(rows[i].unitPrice);
          console.log(rows[i].numSold);
        }
      }
      console.log(rows);

      temp.setState({quantity:''});
      temp.setState({unitPrice:''});
      temp.setState({currentRowSelected:{}});
      temp.setState({rows:rows});
    }

  }


  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    this.loadDistributionNetworkData();
  }

  async loadDistributionNetworkData(){
    var data = testData;
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
    var re = /^\d*[1-9]\d*$/;
    var unsoldQty = temp.state.currentRowSelected.numUnsold;
    var quantity = event.target.value;
    if(quantity > unsoldQty){
      alert("sale quantity cannot be higher than the unsold quantity!");
    }else if (quantity==0 || !(quantity>0 && re.test(quantity))){
      alert("sale quantity must be a positive integer.");
    }else{
       temp.setState({quantity: event.target.value});
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

  checkSelectionValid(){
    console.log("check sell Valid");
    var temp = this;
    var selectedRows  = this.state.selectedRows;
    if(selectedRows){
      console.log(selectedRows);
      for(var i =0; i < selectedRows.length;i++){
        if(selectedRows[i].numSold <= 0 || selectedRows[i].unitPrice <=0){
          return false;
        }
      }
      return true;
    }
  }

  reviewProductsToSell(){
    console.log("send products to sell");
    var temp = this;
    let {rows} = temp.state;
    console.log(temp.state.selection);
    console.log(rows);

    temp.setState({fireRedirect:true});
  }

  render() {
    const { rows, columns, selection,pageSizes,currentPage ,pageSize,
      fireRedirect,selectedRows,editingRowIds,rowChanges,deletingRows,currentRowSelected,
      quantity,unitPrice} = this.state;

    return (
      <div>
        <span>Total rows selected: {selection.length}</span>
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
            <TableSelection showSelectAll />
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.changeRowChanges}
              onCommitChanges={this.commitChanges}/>

          {isAdmin && <TableEditRow
            cellComponent={EditCell}/>
        }
          <TableEditColumn
            width={120}
            // showEditCommand
            showDeleteCommand
            commandComponent={Command}
          />

            <PagingPanel
              pageSizes={pageSizes}
            />
          </Grid>
          <Dialog
            open={!!deletingRows.length}
            onClose={this.cancelDelete}
            // classes={{ paper: classes.dialog }}
          >
            <DialogTitle>Remove product from the sale</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to remove this product from the sale?
              </DialogContentText>
              <Paper>
                <Grid
                  rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                  columns={columns}
                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
              <Button onClick={this.deleteRows} color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
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
              <Paper>
                <Grid
                  rows={[currentRowSelected]}
                  columns={columns}
                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
              <Paper>
                <TextField
                  required
                  margin="dense"
                  id="quantity"
                  label="Enter Quantity"
                  value = { quantity}
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
              <Button onClick={this.updatePriceQtyTable} color="primary">SAVE</Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={!!deletingRows.length}
            onClose={this.cancelDelete}
            // classes={{ paper: classes.dialog }}
          >
            <DialogTitle>Remove product from the sale</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to remove this product from the sale?
              </DialogContentText>
              <Paper>
                <Grid
                  rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                  columns={columns}
                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
              <Button onClick={this.deleteRows} color="secondary">Delete</Button>
            </DialogActions>
          </Dialog>
          <Button raised
                color="primary"
                disabled = {!this.checkSelectionValid()}
                style = {{marginLeft: 550, marginBottom: 30}}
                onClick = {(event) => this.sellProducts(event)}
                primary="true">Sell</Button>
        </Paper>
      </div>
    );
  }
}
