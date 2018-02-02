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
import { withStyles } from 'material-ui/styles';
import Styles from  'react-select/dist/react-select.css';


import dummyData from './dummyData.js';
import * as vendorInterface from '../../interface/vendorInterface.js';
import * as buttons from './Buttons.js';

const styles = theme => ({
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
});

const commandComponents = {
  edit:    buttons.EditButton,
  delete:  buttons.DeleteButton ,
  commit:  buttons.CommitButton,
  cancel:  buttons.CancelButton ,
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

const Cell = (props)=>{
  return <Table.Cell {...props}
    style={{
            whiteSpace: "normal",
            wordWrap: "break-word"
          }}/>
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const EditCell = (props) => {
  return <TableEditRow.Cell {...props} />;
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const getRowId = row => row.id;

class AdminIngredients extends React.PureComponent
{
  constructor(props){
    super(props);
    this.state = {
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'contact', title: 'Contact' },
        { name: 'code', title: 'Code' },
      ],

      // TODO: get data to display from back end
      rows: dummyData,
      sorting: [],
      editingRowIds: [],
      rowChanges: {},
      currentPage: 0,
      deletingRows: [],
      pageSize: 0,
      pageSizes: [5, 10, 0],
      columnOrder: ['name', 'contact', 'code'],
    };

    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.commitChanges = ({ changed, deleted }) =>
    {
      console.log("Commit Changes");
      let { rows } = this.state;
      // If any value in the row is changed
      if (changed) {
        console.log("changed " + Object.keys(changed));
        // Variables to send data to the back end
        var vendorName ="";
        var vendorContact = "";
        var vendorCode = "";
        var vendorId="";
        for(var i =0; i < rows.length; i++)
        {
          // Accessing the changes made to the rows and displaying them
          if(changed[rows[i].id]){
            // Get values so you dont lose it

            if(changed[rows[i].id].name){
              rows[i].name = changed[rows[i].id].name;
              // vendorName = changed[rows[i].id].name;
            }
            if(changed[rows[i].id].contact){
              rows[i].contact = changed[rows[i].id].contact;
              // vendorContact = changed[rows[i].id].contact;
            }
            if(changed[rows[i].id].code){
              rows[i].code = changed[rows[i].id].code;
              // vendorCode = changed[rows[i].id].code;
            }
            // Get the values replaced in the row
            vendorName = rows[i].name;
            vendorContact=rows[i].contact;
            vendorCode= rows[i].code;
            vendorId=rows[i].codeUnique;
          }

        };
        console.log("vendor Id " + vendorId);
        console.log(" name " + vendorName);
        var ingredients = "";
        // TODO: Call updateVendor function to backend
        vendorInterface.updateVendor(vendorName,vendorContact,vendorCode,
        vendorId,ingredients);
      };
      // Delete pop up
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    };

    this.cancelDelete = () => this.setState({ deletingRows: [] });
    this.deleteRows = () => {
      const rows = this.state.rows.slice();
      this.state.deletingRows.forEach((rowId) =>
      {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          // TODO: Update table in Back end
          var sessionId = "";
          console.log("Delete " + rows[index].name);
          vendorInterface.updateVendor(rows[index].vendorId,sessionId);
          // removes data from the table
          rows.splice(index, 1);
        }
      });
      this.setState({ rows, deletingRows: [] });
    };
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
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
            // addedRows={addedRows}
            // onAddedRowsChange={this.changeAddedRows}
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
