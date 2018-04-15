import React from 'react';
import PropTypes from 'prop-types';
import {
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
  SortingState, EditingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table, TableFilterRow, TableHeaderRow, TableEditRow, TableEditColumn,
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
import AddShoppingCartIcon from 'material-ui-icons/AddShoppingCart';
import { withStyles } from 'material-ui/styles';

import Styles from  'react-select/dist/react-select.css';
import ReactSelect from 'react-select';
import {Link} from 'react-router-dom';

import * as productionLineActions from '../../interface/productionLineInterface';
import * as formulaActions from '../../interface/formulaInterface';
import * as testConfig from '../../../resources/testConfig.js';
import * as uploadInterface from '../../interface/uploadInterface';
import PubSub from 'pubsub-js';
import { ToastContainer, toast } from 'react-toastify';
//TODO: Set the user ID
var sessionId = "";
var isAdmin = "";
var isManager = "";
var userId;

var formulaSentToProduction={};

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
  button: {
    margin: theme.spacing.unit,
  },
});

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      title="Create New Production Line"
      component={Link} to={{pathname: '/production-line-details', state:{isCreateNew: true} }}
    >
      New
    </Button>
  </div>
);
AddButton.propTypes = {
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

const commandComponents = {
  add: AddButton,
  delete: DeleteButton,

};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  console.log("this is a command");
  console.log(commandComponents[id]);
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

const Cell = (props) => {
  console.log("Productionline cell props value: ");
  console.log(props);
  if(props.column.name=='name'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/production-line-details', state:{details: props.row} }}>{props.row.name}</Link>
    </Table.Cell>
  }else if(props.column.name=='isIdle'){
    if(!props.row.isIdle){
      return <Table.Cell {...props}>
      <div>BUSY <Button raised>Mark Complete</Button></div>
      </Table.Cell>
    }else{
      return <Table.Cell {...props} />;
    }
  }
  else return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const getRowId = row => row.id;


class ProductionLine extends React.PureComponent {
  constructor(props) {
    super(props);
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    this.state = {
      idToNameMap:{},
      columns: (isAdmin||isManager)?[
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'formulaNames', title: 'Formulas' },
        { name: 'isIdle', title: 'Status' },
      ]:[
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'formulaNames', title: 'Formulas' },
        { name: 'isIdle', title: 'Status' },
      ],
      rows:[],
      // sorting: [],
      editingRowIds: [],
      // addedRows: [],
      rowChanges: {},
      currentPage: 5,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'description', 'formulaNames','isIdle' ],
      options:[],
      productionFormula:{},
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });

    this.commitChanges = ({ deleted }) => {
      let { rows } = this.state;
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
     // if (deleted) {
     //  const deletedSet = new Set(deleted);
     //  rows = rows.filter(row => !deletedSet.has(row.id));
     // }
     // this.setState({ rows });

    };

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows = () => {
      console.log("delete formula rows");
      console.log(this.state.deletingRows);
      const rows = this.state.rows.slice();

      this.state.deletingRows.forEach((rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          // This line removes the data from the rows
          //TODO: Delete in the back end

          var formulaId = rows[index]._id;

          // TODO: Delete does not work
         productionLineActions.deleteProductionLine(formulaId, sessionId, function(res){
            
         });
          console.log("delete " );
          console.log(rows[index]._id);
          console.log(sessionId);
          rows.splice(index, 1);
          // TODO: Add snackbar
          // alert(" Ingredient successfully deleted ! ");
          // this.setState({snackBarMessage : "Formula successfully deleted."});
          // this.setState({snackBarOpen:true});
          toast.success('Formula successfully deleted.', {
            position: toast.POSITION.TOP_RIGHT
          });
          //PubSub.publish('showMessage', 'Formula successfully deleted.' );
        }
      });
      this.setState({ rows, deletingRows: [] });
    };
  }

  componentWillMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    this.loadAllProductionLines();
  }

  componentDidMount(){
    //this.createMap();
  }

  async loadAllProductionLines(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
    //TODO: Get from backend
    var data = await productionLineActions.getAllProductionLinesAsync(sessionId);
    var rawData = (data) ? data : []

      for(var i =0; i < rawData.length;i++){
        var formulaNamesArray  = rawData[i].formulaNames;
        var formulaNamesString = '';
        for(var j = 0; j < formulaNamesArray.length;j++){
          formulaNamesString+=formulaNamesArray[j];
          if(j!= formulaNamesArray.length -1){
            formulaNamesString+=', ';
          }
        }
        rawData[i].formulaNames = formulaNamesString; 
        rawData[i].isIdle = rawData[i].isIdle ? "Idle" : "Busy";
        rawData[i].productionLineId = rawData[i]._id;
      }

    var processedData = [];

    if(rawData){
      processedData = [...rawData.map((row, index)=> ({
        id:index,...row,
      })),];
    }
    this.setState({rows: processedData});
  }


  render() {
    const {classes,} = this.props;
    const {
      rows,
      columns,
      // tableColumnExtensions,
      // sorting,
      editingRowIds,
      // addedRows,
      rowChanges,
      currentPage,
      deletingRows,
      pageSize,
      pageSizes,
      columnOrder,
      productionFormula
    } = this.state;
    return(
      <div>
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}>

          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />

          {/* <IntegratedSorting /> */}
          <IntegratedPaging />

          {isAdmin && <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            // addedRows={addedRows}
            // onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />}
          <DragDropProvider />
          {/* {this.state.snackBarOpen && <SnackBarDisplay
                open = {this.state.snackBarOpen}
                message = {this.state.snackBarMessage}
                handleSnackBarClose = {this.handleSnackBarClose}
              /> } */}
          <Table
            // columnExtensions={tableColumnExtensions}
            cellComponent={Cell}
          />
          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />
          <TableHeaderRow />
          {isAdmin && <TableEditRow
            cellComponent={Cell}
          /> }

          {isAdmin && <TableEditColumn
            width={120}
            showAddCommand
            showDeleteCommand
            commandComponent={Command}
          />}
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>

        {isAdmin && <Dialog
          open={!!deletingRows.length}
          onClose={this.cancelDelete}
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle>Delete Formula</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure to delete the following formula?
            </DialogContentText>
            <Paper>
              <Grid
                rows={rows.filter(row => deletingRows.indexOf(row.id) > -1)}
                columns={columns}
              >
                <Table
                  // columnExtensions={tableColumnExtensions}
                  cellComponent={Cell}
                  order={columnOrder}
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
      }
    </Paper>
  </div>
);
  }

};

// Formula.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles, { name: 'ProductionLine' })(ProductionLine);
