import React from 'react';
import PropTypes from 'prop-types';
import {
  SortingState, EditingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableHeaderRow, TableEditRow, TableEditColumn,
  PagingPanel, DragDropProvider, TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from 'material-ui/Paper';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import { TableCell } from 'material-ui/Table';

import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import SaveIcon from 'material-ui-icons/Save';
import CancelIcon from 'material-ui-icons/Cancel';
import { withStyles } from 'material-ui/styles';

import Styles from  'react-select/dist/react-select.css';
import ReactSelect from 'react-select';
import testData from './testIngredients';
import SelectVendors from './SelectVendors';
import * as ingredientInterface from '../../interface/ingredientInterface';
import * as vendorInterface from '../../interface/vendorInterface';
import * as testConfig from '../../../resources/testConfig.js'
  // TODO: get the sessionId
const sessionId = '5a6a5977f5ce6b254fe2a91f';

const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


const styles = theme => ({
  lookupEditCell: {
    verticalAlign: 'top',
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 1.25,
    paddingLeft: theme.spacing.unit,
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
});

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      onClick={onExecute}
      title="Create new row"
    >
      New
    </Button>
  </div>
);
AddButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Edit row">
    <EditIcon />
  </IconButton>
);
EditButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const DeleteButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Delete row">
    <DeleteIcon />
  </IconButton>
);
DeleteButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Save changes">
    <SaveIcon />
  </IconButton>
);

CommitButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancel changes">
    <CancelIcon />
  </IconButton>
);
CancelButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
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

// options for the drop down
const availableValues = {
  packageName: testData.tablePage.package_options,
  temperatureZone: testData.tablePage.temperatureZone_options,
  // vendors: testData.tablePage.vendor_options,

  // TODO: Get the data from the back end
  vendors: vendorInterface.getAllVendorsAsync(sessionId),
  //vendors: testData.tablePage.vendor_options2,

};


const MultiSelectCellBase = ({
  onValueChange, vendorsArray, classes
}) => (
  <TableCell className={classes.lookupEditCell}>
    
     <SelectVendors initialArray={vendorsArray} handleChange={onValueChange}/>
    {/* </ReactSelect> */}
  </TableCell>
);

MultiSelectCellBase.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  vendorsArray: PropTypes.any,
  classes: PropTypes.object.isRequired,
};

MultiSelectCellBase.defaultProps = {
  value: PropTypes.any,
};

export const MultiSelectCell = withStyles(styles, { name: 'ControlledModeDemo' })(MultiSelectCellBase);


const LookupEditCellBase = ({
  availableColumnValues, value, onValueChange, classes,
}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <Select
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      input={
        <Input
          classes={{ root: classes.inputRoot }}
        />
      }
    >
      {availableColumnValues.map(item => (
        <MenuItem key={item} value={item}>{item}</MenuItem>
      ))}
    </Select>
  </TableCell>
);
LookupEditCellBase.propTypes = {
  availableColumnValues: PropTypes.array.isRequired,
  value: PropTypes.any,
  onValueChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
LookupEditCellBase.defaultProps = {
  value: undefined,
};
export const LookupEditCell = withStyles(styles, { name: 'ControlledModeDemo' })(LookupEditCellBase);


const Cell = (props) => {
  console.log(" CELL props value: " + props.value)
  return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  console.log('Options Choice ' + props.column.name);
  const availableColumnValues = availableValues[props.column.name];
  const vendorsArray = props.row.vendorsArray;

  // EDIT to make changes to the multi select things //
  /* CHANGE */
  if (props.column.name =='vendors') {
    console.log("help");
    console.log(vendorsArray);
    return  <MultiSelectCell {...props} vendorsArray= {vendorsArray} onValueChange={props.onValueChange}/>;
  }else if (availableColumnValues){
    return <LookupEditCell {...props} availableColumnValues={availableColumnValues}/>;
  }
  return <TableEditRow.Cell {...props} />;
};
EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};


const getRowId = row => row.id;


class AdminIngredients extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idToNameMap:{},
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'packageName', title: 'Package' },
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'vendors', title: 'Vendors/Price' },
      ],

      tableColumnExtensions: [
        { columnName: 'vendors', align: 'right' },
      ],

      // TODO: get data to display from back end
      // rows: testData.tablePage.items,
      rows:[],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      deletingRows: [],
      pageSize: 0,
      pageSizes: [5, 10, 0],
      columnOrder: ['name', 'packageName', 'temperatureZone', 'vendors'],
    };

    // console.log(" NAME : " + testData.tablePage.items[0].name);

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeAddedRows = addedRows => this.setState({
      addedRows: addedRows.map(row => (Object.keys(row).length ? row : {

        /* TODO: Change this after getting the data from back End */
        // name: testData.tablePage.ingredient_options[0],
        // vendors: testData.tablePage.vendor_options[0],
        //temperatureZone: testData.tablePage.temperatureZone_options[0],
        //packageName:testData.tablePage.package_options[0],
        temperatureZone: "",
        packageName: "",
        vendorsArray: [],
      })),
    });
    // this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
      console.log("Commit Changes");
      let { rows } = this.state;

      if (added) {
        const startingAddedId = (rows.length - 1) > 0 ? rows[rows.length - 1].id + 1 : 0;

        // TODO: Add checks for Values
        var vendors_string = "";
        for(var i =0; i < added[0].vendors.length; i++){
          var vendorObject = added[0].vendors[i];
          var vendorName = this.state.idToNameMap.get(vendorObject.vendor);
          var namePrice = vendorName + " / $" + vendorObject.price;
          vendors_string += namePrice;
          if(i!= (added[0].vendors).length -1){
            vendors_string+=', ';
          }
        }
        console.log("Added vendors");
        added[0].vendorsArray = added[0].vendors;
        console.log(added[0].vendorsArray);
        added[0].vendors = vendors_string;
        added[0].id = startingAddedId;
        rows = [...rows,added[0]];

        // TODO: Send data to back end
        ingredientInterface.addIngredient(added[0].name, added[0].packageName, added[0].temperatureZone, added[0].vendorsArray, sessionId);

      }

      if (changed) {
        console.log("changed " + Object.keys(changed));

        for(var i =0; i < rows.length; i++){
          // Accessing the changes made to the rows and displaying them
          if(changed[rows[i].id]){
            if(changed[rows[i].id].name){
              rows[i].name = changed[rows[i].id].name;
            }
            if(changed[rows[i].id].packageName){
              rows[i].packageName = changed[rows[i].id].packageName;
            }

            if(changed[rows[i].id].temperatureZone){
              rows[i].temperatureZone = changed[rows[i].id].temperatureZone;
            }
            var vendors_string = "";

            // parse vendors into a string
            if(changed[rows[i].id].vendors){
              for(var j = 0; j < (changed[rows[i].id].vendors).length ; j++){
                console.log("Is this changed?");
                console.log(changed[rows[i].id].vendors[j]);
                var vendorObject = changed[rows[i].id].vendors[j];
                var vendorName = this.state.idToNameMap.get(vendorObject.vendor);
                var namePrice = vendorName + " / $" + vendorObject.price;
                vendors_string += namePrice;
              //   vendors_string += changed[rows[i].id].vendors[j].value;
                if(j!= (changed[rows[i].id].vendors).length -1){
                  vendors_string+=', ';
                }
              }
              rows[i].vendorsArray = changed[rows[i].id].vendors;
              rows[i].vendors = vendors_string;
            }
            ingredientInterface.updateIngredient(rows[i].ingredientId, rows[i].name, rows[i].packageName, rows[i].temperatureZone, rows[i].vendorsArray, sessionId);
      
          };
        };
        //TODO: send data to the back end
      }

    this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    };

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows = () => {
      const rows = this.state.rows.slice();

      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);

        if (index > -1) {
          // This line removes the data from the rows
          //TODO: get the right data and send it to back end for delete
          var name = rows[index].name;
          var packageName = rows[index].packageName;
          console.log("delete");
          console.log(rows[index].ingredientId);
          ingredientInterface.deleteIngredient(rows[index].ingredientId, sessionId);
          rows.splice(index, 1);
        }
        
      });

      this.setState({ rows, deletingRows: [] });
    };

    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
  }

  // handleRowChange({rowChanges}){
    // console.log("ROW CHANGES Keys: " + Object.keys(rowChanges));

    // console.log("RC" + rowChanges.id + rowChanges.name + rowChanges.packageName + rowChanges.vendors);
    // this.setState ({rowChanges: rowChanges});
  // }

  componentWillMount(){
    this.loadAllIngredients();
    this.createMap();
  }

  createMap(){
    var map = new Map();
    map.set("5a76b571c37e254b74f45b3e", "Vendor P");
    map.set("5a76b5bfc37e254b74f45b40", "Vendor R")
    map.set("5a76b607c37e254b74f45b42", "Target");
    this.setState({idToNameMap:map});
  }

  async loadAllIngredients(){
    var rawData = await ingredientInterface.getAllIngredientsAsync(sessionId);
    console.log("rawData");
    console.log(rawData[0].vendors);

    var processedData=[];

    //   var processedData = [...rawData.map((row, index)=> ({
    //     id: startingIndex + index,...row,
    //   })),
    // ];

    // //loop through ingredient
    for (var i = 0; i < rawData.length; i++) {
      var vendorArrayString = "";
      //loop through vendor
      console.log("This is the rawData");
      for (var j=0; j<rawData[i].vendors.length; j++){
        console.log(rawData[i].vendors[j].vendor);
        var vendorName = this.state.idToNameMap.get(rawData[i].vendors[j].vendor);
        console.log(vendorName);
        vendorArrayString+=vendorName + " / $" + rawData[i].vendors[j].price + " ";
      }

      var singleData = new Object ();
      singleData.id = i;
      singleData.name = rawData[i].name;
      singleData.packageName = rawData[i].packageName;
      singleData.temperatureZone = rawData[i].temperatureZone;
      singleData.vendorsArray = rawData[i].vendors;
      //singleData.vendorsArray = "";
      singleData.vendors = vendorArrayString;
      console.log("my id");
      singleData.ingredientId = rawData[i]._id;
      console.log(singleData.ingredientId);
      processedData.push(singleData);
    }
    console.log("loadAllIngredients()");
    console.log(processedData);
    this.setState({rows: processedData});
  }

  render() {
    const {
      classes,
    } = this.props;
    const {
      rows,
      columns,
      tableColumnExtensions,
      sorting,
      editingRowIds,
      addedRows,
      rowChanges,
      currentPage,
      deletingRows,
      pageSize,
      pageSizes,
      columnOrder,
    } = this.state;

    return (
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />

          <IntegratedSorting />
          <IntegratedPaging />

          <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            addedRows={addedRows}
            onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />

          <DragDropProvider />

          <Table
            columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />

          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />

          <TableHeaderRow showSortingControls />
          <TableEditRow
            cellComponent={EditCell}
          />
          <TableEditColumn
            width={120}
            showAddCommand={!addedRows.length}
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
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle>Delete Row</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete the following row?
            </DialogContentText>
            <Paper>
              <Grid
                rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                columns={columns}
              >
                <Table
                  columnExtensions={tableColumnExtensions}
                  cellComponent={Cell}
                />
                <TableHeaderRow />
              </Grid>
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelDelete} color="primary">Cancel</Button>
            <Button onClick={this.deleteRows} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

AdminIngredients.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'ControlledModeDemo' })(AdminIngredients);
