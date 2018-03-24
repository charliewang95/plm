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
import SelectVendors from './SelectVendors';
import * as ingredientInterface from '../../interface/ingredientInterface';
import * as vendorInterface from '../../interface/vendorInterface';
import * as uploadInterface from '../../interface/uploadInterface';
import * as inventoryInterface from '../../interface/inventoryInterface';
  // TODO: get the sessionId
import * as testConfig from '../../../resources/testConfig.js';
import MyPdfViewer from './PdfViewer';
import {Link} from 'react-router-dom';
import Chip from 'material-ui/Chip';
import testData from './testIngredients';

// import Snackbar from 'material-ui/Snackbar';

// import Tabs, {Tab} from 'material-ui/Tabs';
// import AppBar from 'material-ui/AppBar';
// import Intermediates from './intermediates';

// TODO: get session Id from the user

// const sessionId = testConfig.sessionId;
var sessionId = "";


const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
var isAdmin = "";
var isManager = "";

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
      component={Link} to={{pathname: '/ingredient-details', state:{isCreateNew: true} }}
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

const FilterCell = (props) => {
  return <TableFilterRow.Cell {...props} />
}
FilterCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
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

// options for the drop down
const availableValues = {
  packageName: testData.tablePage.package_options,
  temperatureZone: testData.tablePage.temperatureZone_options,
  // vendors: testData.tablePage.vendor_options,

  // TODO: Get the data from the back end
  vendors: sessionId == "" ? null : vendorInterface.getAllVendorsAsync(sessionId),
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
  console.log(" CELL props value: ");
  console.log(props);
  if(props.column.name=='name'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/ingredient-details', state:{details: props.row , isIntermediate:false} }}>{props.row.name}</Link>
    {(props.row.numUnit>0)&&<Chip style={{marginLeft: 10}} label="In Stock"/>}
    </Table.Cell>
  }
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
        { name: 'packageNameString', title: 'Package' },
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'vendors', title: 'Vendors/Price' },
        { name: 'numUnitString', title: "Current Quantity in Stock"},
        { name: 'space', title: "Space Occupied (sqft)"},
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
      columnOrder: ['name', 'temperatureZone', 'packageNameString', 'numUnitString', 'space', 'vendors'],
      options:[],
      // currentTab: 0,
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
        var vendors_string = "";
        if (added[0].vendors == null){
            alert('Vendors must be filled');
        } else {
        for(var i =0; i < added[0].vendors.length; i++){
          var vendorObject = added[0].vendors[i];
          //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
          var vendorName = vendorObject.vendorName;
          console.log(vendorName);
          var namePrice = vendorName + " / $" + vendorObject.price;
          vendors_string += namePrice;
          console.log("this is I");
          console.log(i);
          if(i!= (added[0].vendors).length -1){
            vendors_string+=', ';
          }
        }

        console.log("Added vendors");
        added[0].vendorsArray = added[0].vendors;
        console.log(added[0].vendorsArray);
        added[0].vendors = vendors_string;
        added[0].id = startingAddedId;

        console.log("********************************");
        console.log(added[0].vendorsArray);
        // TODO: Send data to back end
        var temp = this;

        await ingredientInterface.addIngredient(added[0].name, added[0].packageName, added[0].temperatureZone,
          added[0].vendorsArray, 0, 0, added[0].nativeUnit, added[0].numUnitPerPackage, sessionId, function(res){
            if (res.status == 400) {
                if (!alert(res.data))
                    //window.location.reload();
                    temp.setState({rows:rows});

            } else if (res.status == 500) {
                if (!alert('Cannot add ingredient (ingredient already exists/one or more fields are empty)'))
                    //window.location.reload();
                    temp.setState({rows:rows});
          }else{
            // rows = [...rows,added[0]];
            // temp.setState({rows:rows});
            window.reload();
            alert(" New Ingredient Successfully added! ");
          }
        });

      }}

      if (changed) {
        console.log("changed " + Object.keys(changed));

        for(var i =0; i < rows.length; i++){
          // Accessing the changes made to the rows and displaying them=

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
            if(changed[rows[i].id].nativeUnit){
              rows[i].nativeUnit = changed[rows[i].id].nativeUnit;
            }
            if(changed[rows[i].id].numUnitPerPackage){
              const re = /^\d*\.?\d*$/;
              if(changed[rows[i].id].numUnitPerPackage>0 && re.test(changed[rows[i].id].numUnitPerPackage)){
                rows[i].numUnitPerPackage = changed[rows[i].id].numUnitPerPackage;
              }else{
                alert("Quantity must be a number greater than 0!");
              }
            }
            var vendors_string = "";

            // parse vendors into a string
            if(changed[rows[i].id].vendors){
              for(var j = 0; j < (changed[rows[i].id].vendors).length ; j++){
                console.log("Is this changed?");
                console.log(changed[rows[i].id].vendors[j]);
                var vendorObject = changed[rows[i].id].vendors[j];
                //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
                var vendorName = vendorObject.vendorName;
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

            ingredientInterface.updateIngredient(rows[i].ingredientId, rows[i].name, rows[i].packageName,
              rows[i].temperatureZone, rows[i].vendorsArray, rows[i].moneySpent, rows[i].moneyProd,
              rows[i].nativeUnit, rows[i].numUnitPerPackage, sessionId, function(res){
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
          console.log(rows[index].ingredientId);
          ingredientInterface.deleteIngredient(rows[index].ingredientId, sessionId, function(res){
                if (res.status == 400) {
                    alert(res.data);
                } else {
                    alert(" Ingredient successfully deleted ! ");
                    rows.splice(index, 1);
                    window.location.reload();
                }
          });
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

    // console.log("RC" + rowChanges.id + rowChanges.name + rowChanges.packageName + rowChanges.vendors);
    // this.setState ({rowChanges: rowChanges});
  // }

  componentWillMount(){
    this.loadCodeNameArray();
    this.loadAllIngredients();
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
  }

  componentDidMount(){
    //this.createMap();
  }

  // handleTabChange = (event, value) => {
  //   this.setState({ currentTab: value });
  // };

  async loadCodeNameArray(){
   // var startingIndex = 0;
    var rawData = [];
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    rawData = await vendorInterface.getAllVendorNamesCodesAsync(sessionId);
    console.log("loadCodeNameArray was called");
    console.log(rawData.data);

    var list = rawData.data;
    var map = new Map();
     list.forEach(function(vendor){
      map.set(vendor.codeUnique, vendor.name);
    });
    this.setState({idToNameMap:map});

    this.setState({options: rawData.data});
  }

  async createMap(){
    var list = this.state.options;
    console.log("create map!");
    console.log(list);
    var map = new Map();
    list.forEach(function(vendor){
      map.set(vendor.codeUnique, vendor.name);
    });
    this.setState({idToNameMap:map});
  }

  async loadInventoryData(ingredientId, sessionId){
    console.log("enterasdf");
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    var inventoryData = await inventoryInterface.getInventoryAsync(ingredientId, sessionId);
    console.log("loading inventory");
    console.log(inventoryData);
    return inventoryData;
  }

  async loadAllIngredients(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    var rawData = await ingredientInterface.getAllIngredientsAsync(sessionId);
    if(rawData.length==0){
      return
    }
    console.log("rawData asdfasdfasdf");
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
      console.log(rawData[i]);
      var formatVendorsArray = new Array();
      for (var j=0; j<rawData[i].vendors.length; j++){
        //var vendorName = this.state.idToNameMap.get(rawData[i].vendors[j].codeUnique);
        var vendorName = rawData[i].vendors[j].vendorName;
        var price = rawData[i].vendors[j].price;

        var vendorObject = new Object();
        vendorObject.vendorName = vendorName;
        vendorObject.price = price;
        formatVendorsArray.push(vendorObject);

        console.log(vendorName);
        vendorArrayString+=vendorName + " / $" + rawData[i].vendors[j].price;
         if(j!= (rawData[i].vendors.length-1) ){
            vendorArrayString+=', ';
          }
      }

      var singleData = new Object ();
     // singleData.numUnit = this.loadInventoryData(rawData[i]._id, sessionId);
      console.log("singleData");
      console.log(singleData);
      // singleData.id = i;
      singleData.name = rawData[i].name;
      singleData.packageName = rawData[i].packageName;
      singleData.packageNameString = rawData[i].packageName + " (" + rawData[i].numUnitPerPackage + " " + rawData[i].nativeUnit +")";
      singleData.temperatureZone = rawData[i].temperatureZone;
      singleData.vendorsArray = formatVendorsArray;
      singleData.moneySpent = rawData[i].moneySpent;
      singleData.moneyProd = rawData[i].moneyProd;
      singleData.nativeUnit = rawData[i].nativeUnit;
      singleData.numUnitPerPackage = rawData[i].numUnitPerPackage;
      singleData.numUnit = rawData[i].numUnit;
      singleData.numUnitString = rawData[i].numUnit + " " + rawData[i].nativeUnit;
      singleData.space = rawData[i].space;
      //singleData.vendorsArray = "";
      singleData.vendors = vendorArrayString;
      console.log("my id");
      singleData.ingredientId = rawData[i]._id;
      console.log(singleData.ingredientId);
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
           await uploadInterface.uploadIngredient(form, sessionId, function(res){
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
      columnOrder,
      currentTab
    } = this.state;

    return (
      <div>
      {/* <AppBar position="static" color="default">
      <Tabs value={currentTab} onChange={this.handleTabChange.bind(this)}>
      <Tab label = "Ingredients" />
      <Tab label = "Intermediates" />
      </Tabs>
      </AppBar> */}
      {/* {currentTab === 0 && */}
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}

        >
        <FilteringState/>
          <IntegratedFiltering />
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
          <TableFilterRow cellComponent={FilterCell}/>
          {isAdmin && <TableEditRow
            cellComponent={EditCell}
          /> }
          {isAdmin && <TableEditColumn
            width={120}
            showAddCommand={!addedRows.length}
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
      {isAdmin && <p><font size="5">Ingredient Bulk Import</font></p>}
      {isAdmin && <input type="file"
        name="myFile"
        onChange={this.uploadFile} /> }
      {isAdmin &&
      <div>
        <br></br>
        Click <a href="./BulkImportEV2.pdf" style={{color:"#000000",}}>HERE</a> for format specification
      </div>
    }
        <br/>
      {(isAdmin || isManager) && <Button raised color="primary"
      align="left"
      component={Link} to="/orders"
      style = {{marginLeft: 380, marginBottom: 30}}
      > ORDER INGREDIENTS</Button>}

      {/* {currentTab===1 && <Paper> <Intermediates/> </Paper>} */}
    </div>

    );
  }
}

AdminIngredients.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { name: 'ControlledModeDemo' })(AdminIngredients);
