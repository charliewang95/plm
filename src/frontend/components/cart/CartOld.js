
import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {
  Grid,
  Table,
  TableHeaderRow,TableEditColumn,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import {
  EditingState,PagingState,IntegratedPaging
} from '@devexpress/dx-react-grid';

import * as testConfig from '../../../resources/testConfig.js';
import * as cartActions from '../../interface/cartInterface.js';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import Styles from  'react-select/dist/react-select.css';

import {DeleteButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import dummyData from './dummyData.js';
import {Link} from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

// import {VendorCell} from './vendorCell';

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
  if(props.column.name == 'quantity'){
    return <TableEditRow.Cell {...props}
            required
            />;
  };
  return <Cell {...props} />;
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};



EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = DeleteButton;
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

class Cart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'ingredientName', title: 'Ingredient Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'vendors', title: 'Vendors' },
      ],
      rows: [],
      rowChanges: {},
      editingRowIds: [],
      deletingRows: [],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [5, 10, 0],
    };

    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });

    this.commitChanges = ({deleted,changed}) => {
      console.log(" CART DELETE ");
      let { rows } = this.state;
      if(changed){
          for(var i = 0; i < rows.length;i++){
            console.log( " Changed Id " + changed[rows[i].id]);
            if(changed[rows[i].id].quantity){
              // Validate
              // var initialQuantity = "";
              const re = /^[0-9\b]+$/;
              var enteredQuantity = changed[rows[i].id].quantity;
                  if (!re.test(enteredQuantity)) {
                    alert(" Quantity must be a number.");
                  }
                }
              }
            }
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    }

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows = () => {
      const rows = this.state.rows.slice();

      this.state.deletingRows.forEach(async (rowId) => {
        const index = rows.findIndex(row => row.id === rowId);

        if (index > -1) {
          // This line removes the data from the rows
          //TODO: get the right data and send it to back end for delete
          var cartId = rows[index]._id;
          console.log("Deleted Item: " + rows[index].ingredientName);

          //TODO: Call delete cart in back End
          // await cartActions.deleteCart(cartId,sessionId);
          // Delete row from the cart table
          rows.splice(index, 1);

          // console.log(" Cart After Delete " + JSON.stringify(rows));
          alert(" Ingredient successfully removed from cart ! ");

        }

      });

      this.setState({ rows, deletingRows: [] });
    };

    // handle check out of carts
    this.handleCheckOut = async () => {
      // TODO: send data to back End
      console.log("checkout" );
      await cartActions.checkoutCart(sessionId);

      this.setState({rows:[]});

      alert(" Ingredients successfully moved from cart to production ! ");

      // window.location.reload();

    };

  }

  componentWillMount(){
    // this.loadCodeNameArray();
    // this.loadAllIngredients();
    this.loadCartData();
    isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
  }

  componentDidMount(){
    // this.loadCartData()
  };

  async loadCartData(){
    var startingIndex = 0;
    var rawData = '';
    if(READ_FROM_DATABASE){
      // TODO: Initialize data
      sessionId = JSON.parse(localStorage.getItem('user'))._id;
      userId =  JSON.parse(localStorage.getItem('user'))._id;
      rawData = await cartActions.getAllCartsAsync(userId);
      console.log("rawData " + JSON.stringify(rawData));
    } else {
      rawData = dummyData;
    }

    console.log(" Data " + JSON.stringify(rawData));

    var processedData=[];
    var cheapestVendors=[];
    // TODO: Get vendor Options
    for(var i =0; i < rawData.length; i++){
      var singleData = new Object ();
      singleData.name = rawData[i].ingredientName;
      singleData.quantity = rawData[i].quantity;

      console.log(" Data " + JSON.stringify(rawData[i].vendors));

        /* Parse vendors Options */
        var parsedVendorOptions = [...rawData[i].vendors.map((row,index)=> ({
            value: (row.vendorId), label: (row.vendorName + " / Price: $ " + row.price),
            price: row.price,
          })),
        ];
        // console.log(" Vendors Select " + parsedVendorOptions);

        singleData.vendors = parsedVendorOptions;
        singleData.cheapestVendor = rawData[i].cheapestVendor.vendorName;
        // console.log(" Single Data " + JSON.stringify(singleData));
        processedData.push(singleData);
    // Get Cheapest vendors
    // cheapestVendors[i] = rawData[i].cheapestVendor.vendorName;
    // this.setState({vendorOptions:parsedVendorOptions});
  }
    console.log("Vendor Options " + JSON.stringify(parsedVendorOptions));

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
        {/*<Typography type="headline" component="h3">
          Cart
        </Typography>*/}
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
            onCommitChanges={this.commitChanges}
          />

          {isAdmin && <TableEditRow
            cellComponent={EditCell}
          /> }

          <TableEditColumn
            width={120}
            // showAddCommand={!addedRows.length}
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
            <DialogTitle>Check out to production</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to move this ingredient to production?
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
                  primary="true"> Check out for production </Button>
      </div>
      </Paper>

    );
  }
}

// Cart.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default Cart;
