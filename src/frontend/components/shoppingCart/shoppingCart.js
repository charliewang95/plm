
import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {
  Grid,
  Table,
  TableHeaderRow,TableEditColumn,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import {
  EditingState,PagingState,IntegratedPaging,
} from '@devexpress/dx-react-grid';

import * as testConfig from '../../../resources/testConfig.js';

import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Styles from  'react-select/dist/react-select.css';
import { TableCell } from 'material-ui/Table';

import {DeleteButton,EditButton,CancelButton,CommitButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import dummyData from './dummyData.js';
import {Link} from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import VendorCell from './vendorCell';

import * as orderActions from '../../interface/orderInterface.js';
import * as ingredientActions from '../../interface/ingredientInterface.js';

import {cartData, ingredientData} from './dummyData';


// TODO: Get the user ID
const READ_FROM_DATABASE = false;
var isAdmin= "";
var userId = "";
var sessionId = "";

const Cell = (props)=>{
  return <Table.Cell {...props}/>
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};



const EditCell = (props) => {
  // selectedVendor.value is the vendor ID
  const vendorOptions = props.row.vendorOptions;
  const value = props.row.selectedVendorId;

  console.log(" value " + JSON.stringify(value));

  if(props.column.name == 'packageNum'){
    return <TableEditRow.Cell {...props}
            required style={{backgroundColor:'aliceblue'}}
          />;
  }else if(props.column.name == 'vendors'){
    return <VendorCell handleChange = {props.onValueChange}
              vendorOptions = {vendorOptions} value = {value}/>;
  }else{
    return <Cell {...props} style={{backgroundColor:'aliceblue'}}  />;
  }
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

const getRowId = row => row.id;

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'ingredientName', title: 'Ingredient Name' },
        { name: 'packageNum', title: 'No. Of Packages' },
        { name: 'vendors', title: 'Vendor / Price ($)' },
      ],
      rows: [],
      rowChanges: {},
      editingRowIds: [],
      deletingRows: [],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [5, 10, 0],

    };




    this.changeCurrentPage = currentPage => {
      this.setState({ currentPage });
    };
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });

    this.commitChanges =  async ({ changed, deleted }) => {
      let { rows } = this.state;
      var temp = this;

      if(changed){
          for(var i = 0; i < rows.length;i++){
            console.log( " Changed Id " + JSON.stringify(changed[rows[i].id]));
            if(changed[rows[i].id]){
              if(changed[rows[i].id].packageNum){
                // Validate
                const re =/^[1-9]\d*$/;
                var enteredQuantity = changed[rows[i].id].packageNum;
                    if (!re.test(enteredQuantity)) {
                      alert(" Number of packages must be a positive integer");
                    }else{
                      // TODO: Update back end
                      await orderActions.updateOrder(userId,rows[i].ingredientId,rows[i].ingredientName,
                            "", rows[i].packageNum,0,sessionId,function(res){
                              // TODO: Display error on exceeding storage capacity
                              // if(res.status==)
                              // TODO: Add SnackBar
                              // update the table
                              rows[i].packageNum = changed[rows[i].id].packageNum;
                            });
                        }
                    }

               if (changed[rows[i].id].vendors){
                 // TODO: Update Back End -- No error status so no callback??
                 await orderActions.updateOrder(userId,rows[i].ingredientId,rows[i].ingredientName,
                       changed[rows[i].id].vendors.vendorName,rows[i].packageNum,
                       changed[rows[i].id].vendors.price,sessionId);

                 // update table
                  rows[i].vendors = changed[rows[i].id].vendors.label;
                  // update selectedVendor in row
                  rows[i].selectedVendorId =changed[rows[i].id].vendors.vendorId;
                  // TODO: Add SnackBar
              }
            }
          }
        }
        // Delete

        this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
        // TODO: Add SnackBar
    }

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows = () => {
      const rows = this.state.rows.slice();
      this.state.deletingRows.forEach(async (rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          var orderId = rows[index]._id;
          // TODO: update back End
          orderActions.deleteOrder(orderId, sessionId);
          rows.splice(index, 1);
          // TODO: Add SnackBar
          // alert(" Ingredient successfully deleted ! ");
        }
      });
      this.setState({ rows, deletingRows: [] });
    };

    // handle check out orders
    this.handleCheckOut = async () => {
      // TODO: send data to back End
      console.log("checkout" );
      console.log(" ORDERED DATA " + this.state.rows);

      await orderActions.checkoutOrder(sessionId);
      this.setState({rows:[]});

      // TODO: ADD snackbar
      // alert(" Ingredients successfully ordered  ! ");
      // window.location.reload();
    };

  }

  componentWillMount(){
    this.loadCartData();
    // TODO: Change later ?
    sessionId = JSON.parse(localStorage.getItem('user'))._id;
    userId =  JSON.parse(localStorage.getItem('user'))._id;
    isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
  }

  // Initialize data in the table
  async loadCartData(){
    var startingIndex = 0;
    var rawData = [];
    if(READ_FROM_DATABASE){
      rawData = await orderActions.getAllOrdersAsync(sessionId);
      // console.log("rawData " + JSON.stringify(rawData));
    } else {
      rawData = cartData;
    }
    var processedData=[];

    for(var i =0; i < rawData.length; i++){
      var singleData = new Object ();
      singleData.ingredientName = rawData[i].ingredientName;
      singleData.packageNum = rawData[i].packageNum;
      singleData.ingredientId = rawData[i].ingredientId;

      var singleIngredientData = {};

      // TODO: Get vendors from ingredients interface
      if(READ_FROM_DATABASE){
        //TODO: get ingredientDetails from back End
        singleIngredientData = await ingredientActions.getIngredientAsync(rawData[i].ingredientId);
      }else{
        singleIngredientData = ingredientData[i];
      }
      console.log(" ingredient DATA " + JSON.stringify(singleIngredientData));

      // Sort the vendors
      singleIngredientData.vendors.sort(function(a, b) {return a.price - b.price });

        /* Parse vendors Options */
        var parsedVendorOptions = [...singleIngredientData.vendors.map((row,index)=> ({
            value: (row.vendorId), label: (row.vendorName + " / Price: $ " + row.price),
            price: row.price, vendorName:row.vendorName,
          })),
        ];
        // console.log(" Vendors Select " + parsedVendorOptions);

        singleData.vendors = parsedVendorOptions[0].label;
        singleData.vendorOptions= parsedVendorOptions;
        // Id is the value
        singleData.selectedVendorId = parsedVendorOptions[0].value;

        processedData.push(singleData);
  }
    // console.log("Vendor Options " + JSON.stringify(parsedVendorOptions));

    var processedData = [...processedData.map((row, index)=> ({
        id: index,...row,
      })),
    ];
      console.log("processedData " + JSON.stringify(processedData));
      this.setState({rows:processedData});
  }

  render() {
    // const {classes} = this.props;
    const { rows, columns,rowChanges,deletingRows,currentPage,
      pageSize,pageSizes,editingRowIds } = this.state;
    return (

      <Paper>
      <Divider/>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <IntegratedPaging />
          <Table />
          <TableHeaderRow />



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
            showEditCommand
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
            <DialogTitle>Remove ingredient from shopping cart</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to remove this ingredient from shopping cart?
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
        <div
          style = {{marginTop: 30,
                  float: 'center'}}>
        <Button raised
                  color="primary"
                  component = {Link} to = "/cart" //commented out because it overrides onSubmit
                  style={{marginLeft: 380, marginBottom: 30}}
                  type="submit"
                  onClick = {this.handleCheckOut}
                  primary="true"> Order Ingredients </Button>
      </div>
      </Paper>

    );
  }
}

export default ShoppingCart;
