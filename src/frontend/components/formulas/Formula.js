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
import SelectIngredients from './SelectIngredients';

import Styles from  'react-select/dist/react-select.css';
import ReactSelect from 'react-select';
import * as formulaInterface from '../../interface/formulaInterface';
import * as uploadInterface from '../../interface/uploadInterface';
import * as ingredientInterface from '../../interface/ingredientInterface';
  // TODO: get the sessionId
import * as testConfig from '../../../resources/testConfig.js';
import MyPdfViewer from '../admin/PdfViewer';
import {Link} from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';

// TODO: get session Id from the user

// const sessionId = testConfig.sessionId;
var sessionId = "";


const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
var isAdmin = "";

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
  // packageName: testData.tablePage.package_options,
  // temperatureZone: testData.tablePage.temperatureZone_options,
  // ingredients: testData.tablePage.ingredient_options,

  // TODO: Get the data from the back end
  formulas: sessionId == "" ? null : formulaInterface.getAllFormulasAsync(sessionId),
  //ingredients: testData.tablePage.ingredient_options2,

};


const MultiSelectCellBase = ({
  onValueChange, ingredientsArray, classes
}) => (
  <TableCell className={classes.lookupEditCell}>

     <SelectIngredients initialArray={ingredientsArray} handleChange={onValueChange}/>
    {/* </ReactSelect> */}
  </TableCell>
);

MultiSelectCellBase.propTypes = {
  onValueChange: PropTypes.func.isRequired,
  ingredientsArray: PropTypes.any,
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
  const ingredientsArray = props.row.ingredientsArray;

  // EDIT to make changes to the multi select things //
  /* CHANGE */
  if (props.column.name =='ingredients') {
    console.log(ingredientsArray);
    return  <MultiSelectCell {...props} ingredientsArray= {ingredientsArray} onValueChange={props.onValueChange}/>;
  }else if (availableColumnValues){
    return <LookupEditCell {...props} availableColumnValues={availableColumnValues}/>;
  }
  return <TableEditRow.Cell {...props} />;
};
EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

// const SnackBarBase=({message}) => (
//     <Snackbar
//               anchorOrigin={{vertical: 'top', horizontal:'right' }}
//               // open={open}
//               onClose={this.handleClose}
//               SnackbarContentProps={{
//                 'aria-describedby': 'message-id',
//               }}
//               message={<span id="message-id">{message}</span>}
//             />
//           );
//
// export const SnackBarPop = withStyles(styles, { name: 'snackbar' })(SnackBarBase);



const getRowId = row => row.id;


class AdminIngredients extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      idToNameMap:{},
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'unitsProvided', title: 'Units Provided' },
        { name: 'ingredients', title: 'Ingredient/Quantity' },
      ],

      tableColumnExtensions: [
        { columnName: 'ingredients', align: 'right' },
      ],

      // TODO: get data to display from back end
      // rows: testData.tablePage.items,
      rows:[],
      sorting: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      currentPage: 5,
      deletingRows: [],
      pageSize: 10,
      pageSizes: [5, 10, 0],
      columnOrder: ['name', 'description', 'unitsProvided', 'ingredients'],
      options:[],
    };

    // console.log(" NAME : " + testData.tablePage.items[0].name);
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeAddedRows = addedRows => this.setState({
      addedRows: addedRows.map(row => (Object.keys(row).length ? row : {

        /* TODO: Change this after getting the data from back End */
        // name: testData.tablePage.ingredient_options[0],
        // ingredients: testData.tablePage.ingredient_options[0],
        //temperatureZone: testData.tablePage.temperatureZone_options[0],
        //packageName:testData.tablePage.package_options[0],
        temperatureZone: "",
        packageName: "",
        ingredientsArray: [],
      })),
    });
    // this.changeRowChanges = rowChanges => this.setState({ rowChanges });
    this.loadCodeNameArray = this.loadCodeNameArray.bind(this);
    this.createMap = this.createMap.bind(this);

    this.changeRowChanges = (rowChanges) => this.setState({ rowChanges });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });

    this.commitChanges = async ({ added, changed, deleted }) => {
      console.log("Commit Changes");
      let { rows } = this.state;

      if (added) {
        const startingAddedId = (rows.length - 1) > 0 ? rows[rows.length - 1].id + 1 : 0;

        // TODO: Add checks for Values
        var ingredients_string = "";
        if (added[0].ingredients == null){
            alert('Ingredients must be filled');
        } else {
        for(var i =0; i < added[0].ingredients.length; i++){
          var ingredientObject = added[0].ingredients[i];
          //var ingredientName = this.state.idToNameMap.get(ingredientObject.codeUnique);
          var ingredientName = ingredientObject.ingredientName;
          console.log(ingredientName);
          var nameQuantity = ingredientName + " / " + ingredientObject.quantity;
          ingredients_string += nameQuantity;
          console.log("this is I");
          console.log(i);
          if(i!= (added[0].ingredients).length -1){
            ingredients_string+=', ';
          }
        }

        console.log("Added ingredients");
        added[0].ingredientsArray = added[0].ingredients;
        console.log(added[0].ingredientsArray);
        added[0].ingredients = ingredients_string;
        added[0].id = startingAddedId;

        console.log("********************************");
        console.log(added[0].ingredientsArray);
        // TODO: Send data to back end
        var temp = this;
        await formulaInterface.addFormula(added[0].name, added[0].description, added[0].unitsProvided, added[0].ingredientsArray, sessionId, function(res){
            if (res.status == 400) {
                if (!alert(res.data))
                    //window.location.reload();
                    temp.setState({rows:rows});

            } else if (res.status == 500) {
                if (!alert('Formula already exist'))
                    //window.location.reload();
                    temp.setState({rows:rows});
          }else{
            rows = [...rows,added[0]];
            temp.setState({rows:rows});
            alert(" New Formula Successfully added! ");
          }
        });

      }}

      if (changed) {
        console.log("changed " + Object.keys(changed));

        for(var i =0; i < rows.length; i++){
          // Accessing the changes made to the rows and displaying them
          if(changed[rows[i].id]){
            if(changed[rows[i].id].name){
              rows[i].name = changed[rows[i].id].name;
            }
            if(changed[rows[i].id].description){
              rows[i].description = changed[rows[i].id].description;
            }

            if(changed[rows[i].id].unitsProvided){
              rows[i].unitsProvided = changed[rows[i].id].unitsProvided;
            }
            var ingredients_string = "";

            // parse ingredients into a string
            if(changed[rows[i].id].ingredients){
              for(var j = 0; j < (changed[rows[i].id].ingredients).length ; j++){
                console.log("Is this changed?");
                console.log(changed[rows[i].id].ingredients[j]);
                var ingredientObject = changed[rows[i].id].ingredients[j];
                //var ingredientName = this.state.idToNameMap.get(ingredientObject.codeUnique);
                var ingredientName = ingredientObject.ingredientName;
                var nameQuantity = ingredientName + " / $" + ingredientObject.quantity;
                ingredients_string += nameQuantity;
              //   ingredients_string += changed[rows[i].id].ingredients[j].value;
                if(j!= (changed[rows[i].id].ingredients).length -1){
                  ingredients_string+=', ';
                }
              }
              rows[i].ingredientsArray = changed[rows[i].id].ingredients;
              rows[i].ingredients = ingredients_string;
            }
            formulaInterface.updateFormula(rows[i].formulaId, rows[i].name, rows[i].description, rows[i].unitsProvided, rows[i].ingredientsArray, sessionId, function(res){
                if (res.status == 400) {
                    alert(res.data);
                } else if (res.status == 500) {
                    alert('Ingredient name already exists');
                } else {
                    // SnackBarPop("Row was successfully added!");
                    console.log("sdfadfsdf");
                    alert(" Ingredient Successfully edited! ");
                }
            });

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
          console.log(rows[index].formulaId);
          formulaInterface.deleteFormula(rows[index].formulaId, sessionId);
          rows.splice(index, 1);

          //Alert the user
          alert(" Formula successfully deleted ! ");
        }

      });

      this.setState({ rows, deletingRows: [] });
    };

    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };
    this.uploadFile = this.uploadFile.bind(this);
  }

  // handleRowChange({rowChanges}){
    // console.log("ROW CHANGES Keys: " + Object.keys(rowChanges));

    // console.log("RC" + rowChanges.id + rowChanges.name + rowChanges.packageName + rowChanges.ingredients);
    // this.setState ({rowChanges: rowChanges});
  // }

  componentWillMount(){
    //this.loadCodeNameArray();
    this.loadAllIngredients();
    isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
  }

  componentDidMount(){
    //this.createMap();
  }

  async loadCodeNameArray(){
   // var startingIndex = 0;
    var rawData = [];
    sessionId = JSON.parse(localStorage.getItem('user'))._id;
    //rawData = await formulaInterface.getAllIngredientNamesCodesAsync(sessionId);
    console.log("loadCodeNameArray was called");
    console.log(rawData.data);

    var list = rawData.data;
    var map = new Map();
     list.forEach(function(ingredient){
      map.set(ingredient.codeUnique, ingredient.name);
    });
    this.setState({idToNameMap:map});

    this.setState({options: rawData.data});
  }

  async createMap(){
    var list = this.state.options;
    console.log("create map!");
    console.log(list);
    var map = new Map();
    list.forEach(function(ingredient){
      map.set(ingredient.codeUnique, ingredient.name);
    });
    this.setState({idToNameMap:map});
  }

  async loadAllIngredients(){
    sessionId = JSON.parse(localStorage.getItem('user'))._id;
    var rawData = await formulaInterface.getAllFormulasAsync(sessionId);
    if(rawData.length==0){
      return;
    }
    console.log("rawData asdfasdfasdf");
    console.log(rawData[0]);
    var processedData=[];
    //   var processedData = [...rawData.map((row, index)=> ({
    //     id: startingIndex + index,...row,
    //   })),
    // ];

    // //loop through ingredient
    for (var i = 0; i < rawData.length; i++) {
      var formulaArrayString = "";
      //loop through ingredient
      console.log("This is the rawData");
      console.log(rawData[i]);
      var formatFormulasArray = new Array();
      for (var j=0; j<rawData[i].ingredients.length; j++){
        //var ingredientName = this.state.idToNameMap.get(rawData[i].ingredients[j].codeUnique);
        var ingredientName = rawData[i].ingredients[j].ingredientName;
        var quantity = rawData[i].ingredients[j].quantity;

        var formulaObject = new Object();
        formulaObject.ingredientName = ingredientName;
        formulaObject.quantity = quantity;
        formatFormulasArray.push(formulaObject);

        var ingredientArrayString = '';
        console.log(ingredientName);
        ingredientArrayString+=ingredientName + " / " + rawData[i].ingredients[j].quantity;
        console.log("tired");
        console.log(i);
         if(i!= (rawData[i].ingredients.length-1) ){
            ingredientArrayString+=', ';
          }
      }

      var singleData = new Object ();
      // singleData.id = i;
      singleData.name = rawData[i].name;
      singleData.description = rawData[i].description;
      singleData.unitsProvided = rawData[i].unitsProvided;
      singleData.ingredientsArray = formatFormulasArray;
      //singleData.ingredientsArray = "";
      singleData.ingredients = ingredientArrayString;
      console.log("my id");
      singleData.formulaId = rawData[i]._id;
      console.log(singleData.formulaId);
      processedData.push(singleData);
    }

    var finalData = [...processedData.map((row, index)=> ({
        id: index,...row,
      })),
    ];

    console.log("loadAllIngredients()");
    console.log(finalData);
    this.setState({rows: finalData});
  }

    async uploadFile(event) {
        let file = event.target.files[0];
        console.log(file);

        if (file) {
          let form = new FormData();
          form.append('file', file);
          console.log(form);
           await uploadInterface.upload(form, sessionId, function(res){
                if (res.status == 400) {
                    if (!alert(res.data))
                        window.location.reload();
                } else if (res.status == 500) {
                    if (!alert('Duplicate Key on Ingredients (different package not allowed)'))
                        window.location.reload();
                } else if (res.status == 200) {
                    console.log(res);
                    if(!alert(res.data))
                        window.location.reload();
                }
           });

//          console.log(res);
//          if(res == "SUCCESS") {
//            alert("File successfully uploaded!");
//          } else {
//            alert("File upload failed!");
//          }
        }
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
      columnOrder
    } = this.state;

    return (
      <div>
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

          {isAdmin && <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            addedRows={addedRows}
            onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />}

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

          {isAdmin && <TableEditRow
            cellComponent={EditCell}
          /> }
          {isAdmin && <TableEditColumn
            width={120}
            showAddCommand={!addedRows.length}
            showEditCommand
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
      }
      </Paper>
    {/* <Paper styles = {{color : "#42f4d9"}} > */}
      {isAdmin && <p><font size="5">Bulk Import</font></p>}
      {isAdmin && <input type="file"
        name="myFile"
        onChange={this.uploadFile} /> }
      {isAdmin &&
      <div>
        <br></br>
        Click <a href="./FormatSpec.pdf" style={{color:"#000000",}}>HERE</a> for format specification
      </div>
    }

      <Button raised color="primary"
      component={Link} to="/orders"
      style = {{marginLeft: 380, marginBottom: 30}}
      > ORDER INGREDIENTS</Button>

    </div>
    );
  }
}

AdminIngredients.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'ControlledModeDemo' })(AdminIngredients);
