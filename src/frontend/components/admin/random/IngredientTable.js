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

import {ProgressBarCell} from './ProgressBarCell.jsx';
import {HighlightedCell} from './HighlightedCell';

import testData from './testIngredients';

import {
  generateRows,
  globalSalesValues,
} from './generate';

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

const availableValues = {
  pkg: testData.tablePage.package_options,
  temperature: testData.tablePage.temperature_options,
  // vendors: testData.tablePage.vendor_options,
  vendors: testData.tablePage.vendor_options2,

  // DEMO
  // product: globalSalesValues.product,
  // region: globalSalesValues.region,
  // customer: globalSalesValues.customer,
};


// handleOnChange (value) {
//   console.log("CHANGE ");
//     const {multi} = this.state;
//     if (multi) {
//       this.setState({ multiVal: value })
//     } else {
//       this.setState({value:value})
//     }
// };

var variables = [];

const MultiSelectCellBase = ({
  multiVal, multi, availableColumnValues, value, onValueChange, classes,
}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <ReactSelect
        // type = "create"
        multi={false}
        options={availableColumnValues}
        onChange={(option) => onValueChange(option.value)}

        value = {value}
        input={
        <Input
          classes={{ root: classes.inputRoot }}
            id="select-multiple"
        />
      }
    >
    </ReactSelect>
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
  value: undefined,
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
  if (props.column.name === 'vendors') {
    // Print keys of props
    console.log("PROP Keys: " + Object.keys(props));
    console.log("Values: " + Object.values(props));

    // return <ProgressBarCell {...props} />;
  }

  if (props.column.name === 'amount') {
    return <HighlightedCell {...props} />;
  }
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
    multi = {false} multiVal = {[]}/>;
  }else if (availableColumnValues){
    return <LookupEditCell {...props} availableColumnValues={availableColumnValues}/>;
  }
  return <TableEditRow.Cell {...props} />;
};
EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};



/* Class for the multi select stuff */
// class multiSelectClass extends React.Component{
//   constructor(props){
//     super (props);
//
//     this.state = {
//       multiVal:[],
//       multi:false,
//     }
//   }
//
//     handleOnChange (option) {
//       console.log("CHANGE ");
//         const {multi} = this.state;
//         if (multi) {
//           this.setState({ multiVal: value })
//         } else {
//           this.setState({value:value})
//         };
//     };
//
// const MultiSelectCellBase = ({ multiVal, multi, availableColumnValues, value, classes}) => (
//       <TableCell
//         className={classes.multiselectCell}
//       >
//         <ReactSelect
//             // type = "create"
//             multi={true}
//             options={availableColumnValues}
//             onChange={(option) => handleOnChange(option)}
//             value = {value}
//             input={
//             <Input
//               classes={{ root: classes.inputRoot }}
//                 id="select-multiple"
//             />
//           }
//         >
//         </ReactSelect>
//       </TableCell>
//     );
//   };


// export const MultiSelectCell = withStyles(styles, { name: 'ControlledModeDemo' })(MultiSelectCellBase);
//
//   MultiSelectCellBase.propTypes = {
//       availableColumnValues: PropTypes.array.isRequired,
//       value: PropTypes.any,
//       onValueChange: PropTypes.func.isRequired,
//       classes: PropTypes.object.isRequired,
//       multi:PropTypes.bool.isRequired,
//       multiVal: PropTypes.array.isRequired,
//       };
//
//     MultiSelectCellBase.defaultProps = {
//       value: undefined,
//     };


const getRowId = row => row.id;

class AdminIngredients extends React.PureComponent {

  constructor(props) {

    super(props);

    this.state = {
      // multi: false,
      // multiVal:[],
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'pkg', title: 'Package' },
        { name: 'temperature', title: 'Temperature' },
        { name: 'vendors', title: 'Vendors' },

        // DEMO
        // { name: 'saleDate', title: 'Sale Date' },
        // { name: 'customer', title: 'Customer' },
        // { name: 'product', title: 'Product' },
        // { name: 'region', title: 'Region' },
        // { name: 'amount', title: 'Sale Amount' },
        // { name: 'discount', title: 'Discount' },
        // { name: 'saleDate', title: 'Sale Date' },
        // { name: 'customer', title: 'Customer' },
      ],

      tableColumnExtensions: [
        { columnName: 'package', align: 'right' },
      ],
      // DEMO
      // rows: generateRows({
      //   columnValues: { id: ({ index }) => index, ...globalSalesValues },
      //   length: 12,
      // }),

      rows: testData.tablePage.items,
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 0,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [5, 10, 0],
      columnOrder: ['name', 'pkg', 'temperature', 'vendors'],
    };

    console.log(" NAME : " + testData.tablePage.items[0].name);

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeAddedRows = addedRows => this.setState({
      addedRows: addedRows.map(row => (Object.keys(row).length ? row : {

        // DEMO
        // amount: 0,
        // discount: 0,
        // saleDate: new Date().toISOString().split('T')[0],
        // product: availableValues.product[0],
        // region: availableValues.region[0],
        // customer: availableValues.customer[0],

        ingredients: testData.tablePage.ingredient_options[0],
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
        const startingAddedId = (rows.length - 1) > 0 ? rows[rows.length - 1].id + 1 : 0;
        rows = [
          ...rows,
          ...added.map((row, index) => ({
            id: startingAddedId + index,
            ...row,
          })),
        ];
      }
      if (changed) {
        console.log("changed " + Object.keys(changed));
        // console.log("changed Row ID: " + changed[row.id]);

        for(var i =0; i < rows.length; i++){
          // row = rows[i];
          console.log("Row: " +  rows[i].id + " " + rows[i].name + " " + rows[i].pkg + " " + rows[i].temperature);
          console.log("Changed Row Id " + changed[rows[i].id]);

          // Accessing the changes made to the rows and displaying them
          if(changed[rows[i].id]){
            console.log(" ...rows[i] " + {...rows[i]}.name);
            console.log("...changed[rows[i].id] " + {...changed[rows[i].id]}.vendors);
          }

        }
        rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));

      }
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    };
    this.cancelDelete = () => this.setState({ deletingRows: [] });
    this.deleteRows = () => {
      const rows = this.state.rows.slice();
      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          rows.splice(index, 1);
        }
      });
      this.setState({ rows, deletingRows: [] });
    };
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
    /* end of constructor */
  }


  handleRowChange({rowChanges}){
    console.log("ROW CHANGES Keys: " + Object.keys(rowChanges));
    console.log("Vals: " + Object.keys(rowChanges)[0]);
    console.log("Vals: " + Object.keys(rowChanges)[1]);

    console.log("RC" + rowChanges.id + rowChanges.name + rowChanges.pkg + rowChanges.vendors);
    this.setState ({rowChanges: rowChanges});
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
