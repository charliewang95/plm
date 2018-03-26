
import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {
  Grid,
  Table,
  TableHeaderRow,TableEditColumn,PagingPanel,TableEditRow,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';
import {
  EditingState,PagingState,IntegratedPaging,DataTypeProvider,RowDetailState
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
import LotNumberButton from '../admin/LotNumberSelector/LotNumberButton.js';
import SnackBarDisplay from '../snackBar/snackBarDisplay';

// TODO: Get the user ID
const READ_FROM_DATABASE = true;
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
  const quantity = props.row.packageNum;
  const array = props.row.lotNumberArray.ingredientLots;
  console.log("this is the edit cell");
  console.log(array);
  console.log(quantity);
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

const LotNumberFormatter = (props) =>{
  console.log("Formatter");
  console.log(props.row.lotAssigned);
  const quantity = props.row.lotNumberArray.packageNum;

  if(!props.row.lotAssigned){
    return <p>{quantity} / <font color="red">Actions Needed</font></p>
  }else{
    return <p>{quantity} / <font color="green">Completed</font></p>
  }
};

const lotNumberEditor = (props) => {
  const quantity = props.row.lotNumberArray.packageNum;
  const shallowCopy = props.row.lotNumberArray.ingrdientLots;
  // const deepCopy = new Array();
  // var obj = new Object;
  // obj.package = 4;
  // obj.lotNumber = '3333';
  // deepCopy.push(obj);
  let deepCopy = JSON.parse(JSON.stringify(props.row.lotNumberArray.ingredientLots));
  const totalAssigned = props.row.totalAssigned;
  console.log("lotnumbereditor");

  console.log(props);
  return<LotNumberButton totalAssigned = {totalAssigned} initialArray={deepCopy} quantity = {quantity} handlePropsChange={props.onValueChange}></LotNumberButton>

};

const LotNumberProvider = props => (
  <DataTypeProvider
    formatterComponent={LotNumberFormatter}
    editorComponent={lotNumberEditor}
    {...props}
  />
);

const RowDetail = ({ row }) => {
  var string = "";
  row.lotNumberArray.forEach((r) =>(
    string +="lot: " + r.lotNumber + " package: " + r.package + " , "
  ));
  return (
  <div>{string}</div>
)};



const getRowId = row => row.id;

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'ingredientName', title: 'Ingredient Name' },
       // { name: 'packageNum', title: 'null },
        { name: 'vendors', title: 'Vendor / Price ($)' },
        // { key: 'lotNumberArray', title: 'Lot Numbers'}
        { name: 'lotNumberArray',title: 'No. of Packages / Lot Numbers Status'}
        // getCellValue: row => (props.row.totalAssigned!=props.row.packageNum) ? <TableCell><p><font color="red">Actions Needed</font></p></TableCell> :
        //    <TableCell><p><font color="green">Completed</font></p></TableCell>

      ],
      lotNumColumns: ['lotNumberArray'],
      rows: [],
      rowChanges: {},
      editingRowIds: [],
      deletingRows: [],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [5, 10, 0],

      canCheckout: true,


    };
    this.changeCurrentPage = currentPage => {
      this.setState({ currentPage });
    };
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => {console.log("row changes"); console.log(rowChanges); this.setState({ rowChanges })};
    this.changeExpandedDetails = expandedRowIds => this.setState({ expandedRowIds });

    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);

    this.commitChanges =  ({ changed, deleted }) => {
      let { rows } = this.state;
      var temp = this;
      var tempCheckout = true;
      if(changed){
        console.log("asdfsadf changed");
        console.log(changed);
          for(var i = 0; i < rows.length;i++){
            if(changed[rows[i].id]){
              if(changed[rows[i].id].packageNum){
                // Validate
                const re =/^[1-9]\d*$/;
                var enteredQuantity = Number(changed[rows[i].id].packageNum);
                var vendor = rows[i].selectedVendorName ? rows[i].selectedVendorName : rows[i].vendorOptions[0].vendorName;
                var price = rows[i].selectedVendorPrice ? rows[i].selectedVendorPrice : rows[i].vendorOptions[0].price;
                var ingredientLots = rows[i].ingredientLots;
                if (!re.test(enteredQuantity)) {
                  alert(" Number of packages must be a positive integer");
                }else{
                  // TODO: Update back end
                  rows[i].packageNum = changed[rows[i].id].packageNum;
                  orderActions.updateOrder(rows[i]._id, userId,rows[i].ingredientId,rows[i].ingredientName,
                        vendor, enteredQuantity ,price,ingredientLots,sessionId,function(res){
                          // TODO: Display error on exceeding storage capacity
                          // if(res.status==)
                          // TODO: Add SnackBar
                          // update the table
                          console.log('called');
                          if (res.status != 400 && res.status != 500 ){
//                            rows[i].packageNum = enteredQuantity;
                              //window.location.reload();
                          }

                        });
                    }
                }

               if (changed[rows[i].id].vendors){
                 // TODO: Update Back End -- No error status so no callback??
                 console.log("changed vendors");
                 console.log(rows[i]);
                 rows[i].vendors = changed[rows[i].id].vendors.label;
                 rows[i].vendorName = changed[rows[i].id].vendors.vendorName;
                 rows[i].selectedVendorId =changed[rows[i].id].vendors.vendorId;
                 console.log("selected vendor: ");
                 console.log(changed[rows[i].id].vendors.vendorName);
                 console.log(changed[rows[i].id].vendors.price);
                 orderActions.updateOrder(rows[i]._id, userId,rows[i].ingredientId,rows[i].ingredientName,
                       changed[rows[i].id].vendors.vendorName,rows[i].packageNum,
                       changed[rows[i].id].vendors.price, rows[i].ingredientLots, sessionId, function(res){
                        console.log(res);
                         if (res.status != 400 && res.status != 500 ){
//                            rows[i].packageNum = enteredQuantity;
                              console.log(res);
                          }
                       });

                 // update table

                  // update selectedVendor in row
                  // TODO: Add SnackBar
              }

              if (changed[rows[i].id].lotNumberArray){
                var vendor = rows[i].selectedVendorName ? rows[i].selectedVendorName : rows[i].vendorOptions[0].vendorName;
                var price = rows[i].selectedVendorPrice ? rows[i].selectedVendorPrice : rows[i].vendorOptions[0].price;
                var ingredientLots = changed[rows[i].id].lotNumberArray.ingredientLots;
                var packageNum = changed[rows[i].id].lotNumberArray.packageNum;
                rows[i].lotNumberArray.packageNum = packageNum;
                rows[i].lotNumberArray.ingredientLots = ingredientLots;
                console.log(ingredientLots);
                  if(ingredientLots.length>0){

                           var sum = 0;
                    console.log("this is the ingredientLots 222");
                    for(var j=0; j<ingredientLots.length;j++){
                      sum+=parseInt(ingredientLots[j].package);
                    }
                    console.log(sum);
                    rows[i].totalAssigned = sum;
                    rows[i].lotAssigned = (packageNum-sum)==0;

                  }else{
                     rows[i].lotAssigned = false;
                  }
                console.log("changed lotNumberArray");
                console.log(changed[rows[i].id].lotNumberArray);
                console.log("ingredientLots");
                console.log(ingredientLots);
                console.log("quantity");
                console.log(packageNum);
                 orderActions.updateOrder(rows[i]._id, userId,rows[i].ingredientId,rows[i].ingredientName,
                        vendor, Number(packageNum) ,price,ingredientLots,sessionId,function(res){
                        console.log(res);
                         if (res.status != 400 && res.status != 500 ){
//                            rows[i].packageNum = enteredQuantity;
                              console.log(res);
                          }
                       });
               }
            }
            if(!rows[i].lotAssigned){
              tempCheckout = false;
              this.setState({canCheckout:false});
            }
          }//forloop bracket
          if(tempCheckout){
            this.setState({canCheckout: true});
          }

        }//changed bracket
        // Delete
        this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
        // TODO: Add SnackBar
    }//final bracket


    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows =  () => {
      console.log("deleting cart rows")
      const rows = this.state.rows.slice();
      console.log(this.state.deletingRows);

      this.state.deletingRows.forEach((row) => {
        // const index = rows.findIndex(row => row.id === rowId);
        const index = row.rowId;
        console.log(index);

        if (index > -1) {
          var orderId = rows[index]._id;
          // TODO: update back End
          orderActions.deleteOrder(orderId, sessionId);
          rows.splice(index, 1);
          // TODO: Add SnackBar
          this.setState({snackBarMessage : "Order successfully deleted."});
          this.setState({snackBarOpen:true});
        }
      });
      this.setState({ rows, deletingRows: [] });
    };

    // handle check out orders
    this.handleCheckOut = async () => {
      // TODO: send data to back End
      console.log("checkout" );
      console.log(" ORDERED DATA " + this.state.rows);
       var temp = this;

      await orderActions.checkoutOrder(sessionId, function(res){
        if (res.status == 400) {
            if (!alert(res.data)) {
                //window.location.reload();
                //temp.setState({rows:rows});
            }
        } else {
          this.setState({snackBarMessage : "Checkout successful!"});
          this.setState({snackBarOpen:true});
            // alert('Checkout successful!');
            temp.setState({rows:[]});
        }
      });
    };

  }

  handleSnackBarClose(){
    this.setState({snackBarOpen:false});
    this.setState({snackBarMessage: ''});
  }

  componentDidMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId =  JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    this.loadCartData();
  }

  componentWillMount(){
  sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      userId =  JSON.parse(sessionStorage.getItem('user'))._id;
      isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    this.loadCartData();
    // TODO: Change later ?
  }

  // Initialize data in the table
  async loadCartData(){
    var startingIndex = 0;
    var rawData = [];
    if(READ_FROM_DATABASE){
      rawData = await orderActions.getAllOrdersAsync(sessionId);
      console.log("rawData " + JSON.stringify(rawData));

    } else {
      rawData = cartData;
    }
    var processedData=[];

    for(var i =0; i < rawData.length; i++){
      var singleData = new Object ();
      singleData.ingredientName = rawData[i].ingredientName;
      singleData.packageNum = rawData[i].packageNum;
      singleData.ingredientId = rawData[i].ingredientId;
      singleData._id = rawData[i]._id;
      var singleIngredientData = {};

      // TODO: Get vendors from ingredients interface
      if(READ_FROM_DATABASE){
        //TODO: get ingredientDetails from back End
        singleIngredientData = await ingredientActions.getIngredientAsync(rawData[i].ingredientId, sessionId);
        console.log(rawData[i].ingredientId);
        console.log(singleIngredientData);
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
        singleData.selectedVendorName= parsedVendorOptions[0].vendorName;
        singleData.selectedVendorPrice= parsedVendorOptions[0].price;
        // Id is the value
        singleData.selectedVendorId = parsedVendorOptions[0].value;
        singleData.lotNumberArray = new Object();
        singleData.lotNumberArray.ingredientLots = rawData[i].ingredientLots;
        singleData.lotNumberArray.packageNum = rawData[i].packageNum;


        var sum = 0;
        if(rawData[i].ingredientLots.length>0){
          console.log("this is the ingredientLots");
          for(var j=0; j<rawData[i].ingredientLots.length;j++){
            sum+=parseInt(rawData[i].ingredientLots[j].package);
          }
        }
        singleData.totalAssigned = sum;
        singleData.lotAssigned = (rawData[i].packageNum-sum)==0;
        if(!singleData.lotAssigned){
          this.setState({canCheckout:false});
        }
        console.log("this is the single data");
        console.log(singleData);
        processedData.push(singleData);
  }
    // console.log("Vendor Options " + JSON.stringify(parsedVendorOptions));

    var finalData = [...processedData.map((row, index)=> ({
        id: index,...row,
      })),
    ];
      console.log("finalData " + JSON.stringify(finalData));
      this.setState({rows:finalData});
  }

  render() {
    // const {classes} = this.props;
    const { rows, columns,rowChanges,deletingRows,currentPage,
      pageSize,pageSizes,editingRowIds,lotNumColumns ,deleteColumns,deleteRows,
      expandedRowIds} = this.state;
    return (
      <div>
      <Paper>
      <Divider/>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <LotNumberProvider
            for={this.state.lotNumColumns}
          />
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

          {this.state.snackBarOpen && <SnackBarDisplay
                open = {this.state.snackBarOpen}
                message = {this.state.snackBarMessage}
                handleSnackBarClose = {this.handleSnackBarClose}
              /> }

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
                  // rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                  rows = {this.state.deletingRows}
                  columns={this.state.deleteColumns}
                >
                <RowDetailState
                  expandedRowIds={expandedRowIds}
                  onExpandedRowIdsChange={this.changeExpandedDetails}
                />
                <Table />
                <TableHeaderRow />
                <TableRowDetail
                  contentComponent={RowDetail}
                />
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
        {this.state.rows.length!=0 && <Button raised
                  color="primary"
                  component = {Link} to = "/cart" //commented out because it overrides onSubmit
                  style={{marginLeft: 500, marginBottom: 30, float: 'center'}}
                  type="submit"
                  onClick = {this.handleCheckOut}
                  primary="true"
                  disabled = {!this.state.canCheckout}> Checkout </Button>}
      </div>
      </Paper>
    </div>

    );
  }
}

export default ShoppingCart;
