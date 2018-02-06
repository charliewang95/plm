import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';


import {
  FilteringState,
  IntegratedFiltering,EditingState,
  RowDetailState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableEditRow,
  TableEditColumn,
  TableColumnReordering,
  TableSelection,
  TableRowDetail,
} from '@devexpress/dx-react-grid-material-ui';

import dummyData from './dummyData';
import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import ShoppingCartButton from './ShoppingCartButton.js';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import * as cartActions from '../../interface/cartInterface';
import * as inventoryActions from '../../interface/inventoryInterface';
import * as testConfig from '../../../resources/testConfig.js'
import IngredientDetail from './IngredientDetail';



//TODO: Get if it ADMIN
var  isAdmin= true;
const userId = "5a63be959144b37a6136491e";
// const sessionId = "5a63be959144b37a6136491e";
const sessionId = testConfig.sessionId;
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

const Cell = (props)=>{
  return <Table.Cell {...props}
    style={{
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}
        />
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

const commandComponents = {
  edit:    EditButton,
  commit:  CommitButton,
  cancel:  CancelButton,
  // This is for the shopping cart- had to do this way because
  // the package has delete integrated in the TableEditColumn --
  // look into devextreme TableEditColumn API for details
  delete: ShoppingCartButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
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

const toLowerCase = value => String(value).toLowerCase();
const temperatureZonePredicate = (value, filter) => toLowerCase(value).startsWith(toLowerCase(filter.value));


class Inventory extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'ingredientName', title: 'Ingredient Name' },
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'quantity', title: 'Quantity (lbs)' },
        { name: 'packageName', title: 'Package Name' },
      ],
      editingRowIds: [],
      rowChanges: {},
      tableColumnExtensions: [
        { columnName: 'ingredientName', align: 'left' },
      ],
      integratedFilteringColumnExtensions: [
        { columnName: 'temperatureZone', predicate: temperatureZonePredicate },
      ],
      rows: [],
      addingItemsToCart:[],
      addedQuantity:'',
      expandedRowIds:[],
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeSelection = selection => this.setState({ selection });
    this.changeRowChanges = (rowChanges) => {
      console.log(" ROW CHANGES: ");
      this.setState({ rowChanges });
    }

    this.cancelItemOnCart = () => this.setState({ addingItemsToCart: [] });

    this.commitChanges = ({ changed,deleted}) => {
      let { rows } = this.state;

      console.log(JSON.stringify(rows));
      console.log("changed " + JSON.stringify(changed));

      if(changed){
        for(var i = 0; i < rows.length;i++){
          console.log( " Changed Id " + changed[rows[i].id]);
          if(changed[rows[i].id]){
            // Validate
            const re = /^[0-9\b]+$/;
            var enteredQuantity = changed[rows[i].id].quantity;
                if (re.test(enteredQuantity)) {
                   rows[i].quantity = changed[rows[i].id].quantity;
                }else{
                  alert(" Quantity must be a number.");
                }
            //TODO: Update the inventory
            try{
              inventoryActions.updateInventory(rows[i]._id, userId,
                rows[i].ingredientId, rows[i].ingredientName,
                rows[i].temperatureZone, rows[i].packageName,
                parseInt(changed[rows[i].id].quantity,10), sessionId);
            }catch(e){
              console.log('An error passed to the front end!')
              //TODO: error handling in the front end
              alert(e);
            }
        }
      }
     }

     this.setState({ rows, addingItemsToCart: deleted || this.state.addingItemsToCart });

     // Called from the deleteCommand
     this.addToCart=() => {
       console.log(" Added Quantity " + this.state.addedQuantity);
       this.state.addingItemsToCart.forEach((rowId) => {
         const index = rows.findIndex(row => row.id === rowId);
         if (index > -1) {

           //TODO: Send data to cart
           console.log("Name" + rows[index].ingredientName);
           console.log("Package " + rows[index].packageName);
           console.log("ingredientId " + rows[index].ingredientId);

             try{
               cartActions.addCart(userId, rows[index].ingredientId, rows[index].ingredientName,
                  parseInt(this.state.addedQuantity), sessionId);
              }catch(e){
                console.log('An error passed to the front end!')
                //TODO: error handling in the front end
                alert(e);
              }
            }
          });
          this.setState({ rows, addingItemsToCart: [] });
       }
     };
     // Set state of the expandable rows
     this.changeExpandedDetails = (expandedRowIds) => {
       console.log("Changed Expanded RowIds ");
       this.setState({ expandedRowIds });
     }
   }

// Initial loading of data
  componentDidMount() {
    this.loadInventory();
  }

  async loadInventory() {
    console.log("LOADING DATA");
    var processedData=[];
    //TODO: Initialize data
    var rawData=[];
     if(READ_FROM_DATABASE){
       rawData = await inventoryActions.getAllInventoriesAsync(sessionId);
     } else {
      rawData = dummyData;
     }

    var startingIndex = 0;
    var processedData = [...rawData.map((row, index)=> ({
        id: index,...row,
      })),
    ];
    this.setState({rows:processedData});
  }

    handleIngredientQuantity(event){
    const re = /^[0-9\b]+$/;
        if (event.target.value == '' || re.test(event.target.value)) {
           this.setState({addedQuantity: parseInt(event.target.value,10)})
        }else{
          alert(" Quantity must be a number.");
        }
    }


  render() {
    // const { rows, columns, integratedFilteringColumnExtensions } = this.state;
    const {classes,} = this.props;
    const { rows, columns,editingRowIds,
      rowChanges,tableColumnExtensions,
      integratedFilteringColumnExtensions,addingItemsToCart,addedQuantity,expandedRowIds} = this.state;
    return (
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          {/* <FilteringState defaultFilters={[{ columnName: 'temperatureZone', value: 'frozen' }]} /> */}
          <FilteringState/>
          {isAdmin &&
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.changeRowChanges}
              onCommitChanges={this.commitChanges}
            />}

          <IntegratedFiltering columnExtensions={integratedFilteringColumnExtensions} />
          <RowDetailState
                      expandedRowIds={expandedRowIds}
                      onExpandedRowIdsChange={this.changeExpandedDetails}
                    />
          <Table cellComponent={Cell}/>
          <TableHeaderRow />
          <TableFilterRow />
          <TableRowDetail
            contentComponent={IngredientDetail}
          />
          {isAdmin &&
            <TableEditRow
              cellComponent={EditCell}
            />
          }
          {isAdmin &&
            <TableEditColumn
              width={120}
              showEditCommand
              showDeleteCommand
              commandComponent={Command}
            />}

        </Grid>

        <Dialog
          open={!!addingItemsToCart.length}
          onClose={this.cancelItemOnCart}
        >
          <DialogTitle>Add Ingredient To Cart</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please add the amount (in lbs) you want to add to cart.
            </DialogContentText>
              <Paper>
                <label> </label>
                <Grid
                  rows={rows.filter(row => addingItemsToCart.indexOf(row.id) > -1)}
                  columns={columns}
                >
                  <Table
                    columnExtensions={tableColumnExtensions}
                    cellComponent={Cell}
                  />
                <TableHeaderRow />
              </Grid>
            </Paper>
            <Divider />
            <Paper>
              <TextField
                required
                autoFocus
                margin="dense"
                id="quantity"
                label="Enter Quantity (lbs)"
                fullWidth = {false}
                onChange={(event) => this.handleIngredientQuantity(event)}
                verticalSpacing= "desnse"
                style={{
                marginLeft: 20,
                martginRight: 20
                }}/>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelItemOnCart} color="primary">Cancel</Button>
            <Button onClick={this.addToCart} color="secondary">Add</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

Inventory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Inventory;
