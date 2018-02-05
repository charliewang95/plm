import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {
  Grid,
  Table,
  TableHeaderRow,TableEditColumn,PagingPanel
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



// TODO: Get the user ID
const userId = "5a63be959144b37a6136491e";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
const sessionId = testConfig.sessionId;

const Cell = (props) => {
  console.log(" CELL props value: " + props.value)
  return <Table.Cell {...props} />;
};

Cell.propTypes = {
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
      ],
      rows: [],
      rowChanges: {},
      deletingRows: [],
      currentPage: 0,
      pageSize: 0,
      pageSizes: [5, 10, 20],
    };

    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });

    this.commitChanges = ({deleted}) => {
      let { rows } = this.state;
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    }

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows = () => {
      const rows = this.state.rows.slice();

      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);

        if (index > -1) {
          // This line removes the data from the rows
          //TODO: get the right data and send it to back end for delete
          var cartId = rows[index]._id;
          console.log("Deleted Item: " + rows[index].ingredientName);

          //TODO: Call delete cart in back End
          cartActions.deleteCart(cartId,sessionId);
          // Delete row from the cart table
          rows.splice(index, 1);
        }

      });

      this.setState({ rows, deletingRows: [] });
    };

    // handle check out of carts
    this.handleCheckOut = () => {
      // TODO: send data to back End
      console.log("checkout");
      cartActions.checkoutCart(sessionId);
    };

  }

  componentDidMount(){
    this.loadCartData();
  }

  async loadCartData(){
    var startingIndex = 0;
    var rawData = dummyData;
    if(READ_FROM_DATABASE){
      // TODO: Initialize data
      rawData = await cartActions.getAllCartsAsync(userId);
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
    const {classes} = this.props;
    const { rows, columns,rowChanges,deletingRows,currentPage,
      pageSize,pageSizes } = this.state;
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
            // editingRowIds={editingRowIds}
            // onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            // onRowChangesChange={this.changeRowChanges}
            onCommitChanges={this.commitChanges}
          />

          <TableEditColumn
            width={120}
            // showAddCommand={!addedRows.length}
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
            <DialogTitle>Remove item from cart</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to remove the following item?
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
                  style={{marginLeft: 400, marginBottom: 30}}
                  type="submit"
                  onClick = {this.handleCheckOut}
                  primary="true"> Check Out </Button>
      </div>
      </Paper>

    );
  }
}

Cart.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Cart;
