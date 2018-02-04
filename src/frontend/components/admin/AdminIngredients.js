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
  pkg: testData.tablePage.package_options,
  temperature: testData.tablePage.temperature_options,
  // vendors: testData.tablePage.vendor_options,

  // TODO: Get the data from the back end
  vendors: testData.tablePage.vendor_options2,

};

var variables = [];

const MultiSelectCellBase = ({
  multiVal, multi, availableColumnValues, value, onValueChange, classes,
}) => (
  <TableCell className={classes.lookupEditCell}>
    <ReactSelect.Creatable
        // type = "create"
        multi={true}
        options={availableColumnValues}
        // onChange={(option) => {{value : option}};
        onChange={(option) => {onValueChange(option); multiVal.push(option);}}
        value = {value}
        input={
        <Input
          classes={{ root: classes.inputRoot }}
            id="select-multiple"
        />
      }
    />
     <SelectVendors />
    {/* </ReactSelect> */}
  </TableCell>
);

MultiSelectCellBase.propTypes = {
  availableColumnValues: PropTypes.array.isRequired,
  value: PropTypes.any,
  onValueChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  multi:PropTypes.bool.isRequired,
  multiVal: PropTypes.array.isRequired,
};

MultiSelectCellBase.defaultProps = {
  value: PropTypes.any,
};

export const MultiSelectCell = withStyles(styles, { name: 'ControlledModeDemo' })(MultiSelectCellBase);


const LookupEditCellBase = ({
  availableColumnValues,value, onValueChange, classes,
}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <Select
      value={value}
      onChange={(event)=> onValueChange(event.target.value)}
      input={
        <Input
          classes={{ root: classes.inputRoot }}
          id="select-multiple"
        />
      }
    >
      // Creates the menu */
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
  return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  console.log('Options Choice ' + props.column.name);
  const availableColumnValues = availableValues[props.column.name];

  // EDIT to make changes to the multi select things //
  /* CHANGE */
  if (props.column.name =='vendors') {
    console.log('Options ' + availableColumnValues);
    return  <MultiSelectCell {...props} availableColumnValues={availableColumnValues}
    multi = {true} multiVal = {[]}/>;
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
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'pkg', title: 'Package' },
        { name: 'temperature', title: 'Temperature' },
        { name: 'vendors', title: 'Vendors/Price' },
      ],

      tableColumnExtensions: [
        { columnName: 'package', align: 'right' },
      ],

      // TODO: get data to display from back end
      rows: testData.tablePage.items,
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      deletingRows: [],
      pageSize: 0,
      pageSizes: [5, 10, 0],
      columnOrder: ['name', 'pkg', 'temperature', 'vendors'],
    };

    console.log(" NAME : " + testData.tablePage.items[0].name);

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeAddedRows = addedRows => this.setState({
      addedRows: addedRows.map(row => (Object.keys(row).length ? row : {

        name: testData.tablePage.ingredient_options[0],
        vendors: testData.tablePage.vendor_options[0],
        temperature: testData.tablePage.temperature_options[0],
        pkg:testData.tablePage.package_options[0],
      })),
    });
    // this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.changeRowChanges = (rowChanges) => {this.handleRowChange({rowChanges})};
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ added, changed, deleted }) => {
      console.log("Commit Changes");
      let { rows } = this.state;

      if (added) {
        console.log(" added " + added);
        console.log(" Keys " + Object.keys(added));
        // console.log("Id " + added.row.id);
        const startingAddedId = (rows.length - 1) > 0 ? rows[rows.length - 1].id + 1 : 0;
        console.log("Starting Id " + startingAddedId);


        // TODO: Add checks for Values
        var vendors_string = "";

        for(var i =0; i < added[0].vendors.length; i++){
          vendors_string+=added[0].vendors[i].value;
          if(i!= (added[0].vendors).length -1){
            vendors_string+=',';
          }
        }
        added[0].vendors = vendors_string;
        added[0].id = startingAddedId;

        rows = [...rows,added[0]];

        // TODO: Send data to back end

      }

      if (changed) {
        console.log("changed " + Object.keys(changed));

        for(var i =0; i < rows.length; i++){
          // Accessing the changes made to the rows and displaying them
          if(changed[rows[i].id]){
            if(changed[rows[i].id].name){
              rows[i].name = changed[rows[i].id].name;
            }
            if(changed[rows[i].id].pkg){
              rows[i].pkg = changed[rows[i].id].pkg;
            }

            if(changed[rows[i].id].temperature){
              rows[i].temperature = changed[rows[i].id].temperature;
            }
            var vendor_string = "";

            // parse vendors into a string
            if(changed[rows[i].id].vendors){
              for(var j = 0; j < (changed[rows[i].id].vendors).length ; j++){
                vendor_string += changed[rows[i].id].vendors[j].value;
                if(j!= (changed[rows[i].id].vendors).length -1){
                  vendor_string+=',';
                }
              }
              rows[i].vendors = vendor_string;
            }
          };
        };
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
          var pkg = rows[index].pkg;

          rows.splice(index, 1);
        }
      });

      this.setState({ rows, deletingRows: [] });
    };

    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
  }

  handleRowChange({rowChanges}){
    console.log("ROW CHANGES Keys: " + Object.keys(rowChanges));

    console.log("RC" + rowChanges.id + rowChanges.name + rowChanges.pkg + rowChanges.vendors);
    this.setState ({rowChanges: rowChanges});
  }

  loadAllIngredients(){
    const sessionId = '5a6a5977f5ce6b254fe2a91ff';
    var rawData = ingredientInterface.getAllIngredientsAsync(sessionId);
    var processedData = [];

    //loop through ingredient
    for (var i = 0; i < rawData.length; i++) { 
      var vendorArrayString = "";
      //loop through vendor
      for (var j=0; j<rawData.vendors.length; j++){
        vendorArrayString+=rawData.vendors[j].name + "/ $" + rawData.vendors[j].price + ", ";
      }
      var singleData = new Object ("id": i, "name": rawData.name, "pkg": "sack", "temperature": rawData.temperatureZone, "vendors" : vendorArrayString);
      processedData.push(singleData);
    }
    this.setState({rows: processedData});
  }

  componentDidMount() {
    //this.loadAllIngredients();
  }
  // componentDidUpdate() {
  //   this.loadAllIngredients();
  // }

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
