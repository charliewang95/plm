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
import { withStyles } from 'material-ui/styles';

import Styles from  'react-select/dist/react-select.css';
import ReactSelect from 'react-select';
import {Link} from 'react-router-dom';

import * as ingredientActions from '../../interface/ingredientInterface';
import * as formulaActions from '../../interface/formulaInterface';
import * as testConfig from '../../../resources/testConfig.js';
import MyPdfViewer from '../admin/PdfViewer';
import * as uploadInterface from '../../interface/uploadInterface';
import formulaData from './dummyData';

//TODO: Set the user ID
var sessionId = "";
var isAdmin = "";
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
      title="Create New Ingredient"
      component={Link} to={{pathname: '/formula-details', state:{isCreateNew: true} }}
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

const AddToProdButton = ({selectedFormula, onExecute}) => (
  console.log(" selectedFormula " + selectedFormula),
  // formulaSentToProduction = selectedFormula,
  // alert(formulaSentToProduction),
  <div style={{ textAlign: 'center' }}>
    <Button
      color="primary"
      title="Send formula to production"
      component={Link} to={{pathname: '/production-review', state:{selectedFormula: selectedFormula} }}
    > Use Formula
    </Button>
  </div>
);
AddToProdButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

const Cell = (props) => {
  console.log(" CELL props value: ");
  console.log(props);
  if(props.column.name=='name'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/formula-details', state:{details: props.row} }}>{props.row.name}</Link>
    </Table.Cell>
  }else if (props.column.key=='sendToProd'){
    // <Link to={{pathname: '/product-review', state:{selectedFormula: props.row} }}}
    return <AddToProdButton  selectedFormula = {props.row}/>
  }
  return <Table.Cell {...props} />;
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const getRowId = row => row.id;


class Formula extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idToNameMap:{},
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'unitsProvided', title: 'Product Units ' },
        { name: 'ingredients', title: 'Ingredient / Quantity' },
        {key: 'sendToProd', title:''},
      ],
      rows:[],
      // sorting: [],
      editingRowIds: [],
      // addedRows: [],
      rowChanges: {},
      currentPage: 5,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [5, 10, 0],
      columnOrder: ['name', 'description', 'unitsProvided', 'ingredients','sendToProd'],
      options:[],
      productionFormula:{},
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });

    this.commitChanges = async ({ deleted }) => {
      let { rows } = this.state;
      this.setState({ rows, deletingRows: deleted || this.state.deletingRows });
    };

    this.cancelDelete = () => this.setState({ deletingRows: [] });

    this.deleteRows = () => {
      const rows = this.state.rows.slice();

      this.state.deletingRows.forEach(async (rowId) => {
        const index = rows.findIndex(row => row.id === rowId);
        if (index > -1) {
          // This line removes the data from the rows
          //TODO: Delete in the back end

          var formulaId = rows[index]._id;

          await formulaActions.deleteFormula(formulaId, sessionId);
          
          console.log("delete");
          console.log(rows[index].name);
          rows.splice(index, 1);
          // TODO: Add snackbar
          // alert(" Ingredient successfully deleted ! ");
        }

      });
      this.setState({ rows, deletingRows: [] });
    };

    this.uploadFile = this.uploadFile.bind(this);


  }

  componentWillMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    this.loadAllFormulas();

  }

  componentDidMount(){
    //this.createMap();
  }

  async loadAllFormulas(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    //TODO: Get from backend
    var rawData = await formulaActions.getAllFormulasAsync(sessionId);

    console.log(" Formulas " + JSON.stringify(rawData));


    for(var i =0; i < rawData.length;i++){
        var ingredientsArray  = rawData[i].ingredients;
        var ingredientsString = '';

        for(var j = 0; j < ingredientsArray.length;j++){
          ingredientsString+=ingredientsArray[j].ingredientName + " / " +
                          ingredientsArray[j].quantity;

          if(j!= ingredientsArray.length -1){
            ingredientsString+=', ';
          }
        }
        // NEEDS TO BE BEFORE
        rawData[i].ingredientsArray = rawData[i].ingredients;
        rawData[i].ingredients = ingredientsString;
      }

        var processedData = [...rawData.map((row, index)=> ({
          id:index,...row,
          })),
        ];

      console.log(" PROCESSED DATA " + JSON.stringify(processedData));
      this.setState({rows: processedData});

      }


    async uploadFile(event) {
      console.log(" UPLOAD FILE ");
        let file = event.target.files[0];

        console.log(file);

        if (file) {
          let form = new FormData();
          form.append('file', file);
          console.log(form);
           await uploadInterface.uploadFormula(form, sessionId, function(res){
                if (res.status == 400) {
                    if (!alert(res.data))
                        window.location.reload();
                } else if (res.status == 500) {
                    if (!alert('Duplicate Key on Formula (different package not allowed)'))
                        window.location.reload();
                } else if (res.status == 200) {
                    console.log(res);
                    if(!alert(res.data))
                        window.location.reload();
                }
           });
         }
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
    {/* <Paper styles = {{color : "#42f4d9"}} > */}
      {isAdmin && <p><font size="5">Formula Bulk Import</font></p>}
      {isAdmin && <input type="file"
        name="myFile"
        onChange={this.uploadFile} /> }
      {isAdmin &&
      <div>
        <br></br>
        Click <a href="./BulkImportEV2.pdf" style={{color:"#000000",}}>HERE</a> for format specification
      </div>
    }
  </div>
);
  }

};

// Formula.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles, { name: 'Formula' })(Formula);
