
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

import {Link} from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';




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

const getRowId = row => row.id;

class SellProductsReview extends React.Component {
  constructor(props) {
    super(props);
    var dummyObject = new Object();
    const details = (props.location.state.selectedRows)?(props.location.state.selectedRows):dummyObject;
    this.state = {
      columns: [
        { name: 'productName', title: 'Product Name ' },
        { name: 'numUnit', title: 'Total Quantity' },
        { name: 'numUnsold', title: 'Unsold Quantity' },
        { name: 'numSold', title: 'Sale Quantity' },
        { name: 'unitPrice', title: 'Unit Price ($)' },
        { name: 'totalRevenue', title: 'Revenue ($)' },
      ],
      rows: [],
      rowChanges: {},
      editingRowIds: [],
      deletingRows: [],
      currentPage: 0,
      pageSize: 20,
      pageSizes: [5, 10, 50],
      grandTotalRevenue:0,
    };
    this.changeCurrentPage = currentPage => {
      this.setState({ currentPage });
    };
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });

    this.commitChanges =  ({ changed, deleted }) => {
      let { rows } = this.state;
      var temp = this;

      if(changed){
          for(var i = 0; i < rows.length;i++){
            if(changed[rows[i].id]){
              if(changed[rows[i].id].numSold){
                console.log("changed quantity");
                console.log(changed[rows[i].id].numSold);
                }

               if (changed[rows[i].id].unitPrice){
                 console.log("changed UnitPrice");
                 console.log(changed[rows[i].id].unitPrice);
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
      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          var orderId = rows[index]._id;
          // TODO: update back End
          rows.splice(index, 1);
          // TODO: Add SnackBar
          // alert(" Ingredient successfully deleted ! ");
        }
      });
      this.setState({ rows, deletingRows: [] });
    };

    // handle check out orders
    this.handleSale = async () => {
      // TODO: send data to back End
      console.log("checkout" );
      console.log(" ORDERED DATA " + this.state.rows);
       var temp = this;

      // await orderActions.checkoutOrder(sessionId, function(res){
      //   if (res.status == 400) {
      //       if (!alert(res.data)) {
      //           //window.location.reload();
      //           //temp.setState({rows:rows});
      //       }
      //   } else {
      //       alert('Checkout successful!');
      //       temp.setState({rows:[]});
      //       TODO: ADD snackbar
      //   }
      // });
    };

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount(){
    this.loadData();
  }

  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId =  JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
  }

  // Initialize data in the table
   loadData(){
    console.log("load Sale Data");
    var data = this.props.location.state.selectedRows;
    console.log(data);

    var processedData = [...data.map((row, index)=> ({
        id: index,...row,
      })),
    ];

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
        {this.state.rows.length!=0 && <Button raised
                  color="primary"
                  component = {Link} to = "/cart" //commented out because it overrides onSubmit
                  style={{marginLeft: 500, marginBottom: 30, float: 'center'}}
                  type="submit"
                  onClick = {this.handleCheckOut}
                  primary="true"> SELL </Button>}
      </div>
      </Paper>

    );
  }
}

export default SellProductsReview;
