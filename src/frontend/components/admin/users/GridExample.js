// GridExample.js
import React from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import {
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid'; //for filtering
import {
	SortingState,
	IntegratedSorting
} from '@devexpress/dx-react-grid'; // for sorting
import {
	DataTypeProvider, //for ???
	EditingState,// for editing
} from '@devexpress/dx-react-grid'; 
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow, // for filtering
  TableEditRow, //for editing
  TableEditColumn, //for editing
} from '@devexpress/dx-react-grid-material-ui';
// for selecting previlege level
import Chip from 'material-ui/Chip';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
//
import { TableCell } from 'material-ui/Table'; //for customize filter row
import { withStyles } from 'material-ui/styles';
//local components
import * as userInterface from '../../../interface/userInterface';
import * as utils from '../../../utils/utils';

const styles = theme => ({
  cell: {
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  input: {
    width: '100%',
  },
});

const getRowId = row => row.id;
//for dukeOAuth
const BooleanFormatter = ({ value }) =>
  <Chip label={value ? 'Yes' : 'No'} />;
const BooleanEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value ? 'Yes' : 'No'}
    onChange={event => onValueChange(event.target.value === 'Yes')}
    style={{ width: '100%', marginTop: '4px' }}
  >
    <MenuItem value="Yes">Yes</MenuItem>
    <MenuItem value="No">No</MenuItem>
  </Select>
);
const BooleanTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={BooleanFormatter}
    editorComponent={BooleanEditor}
    {...props}
  />
);

//for previleges
const PrevilegeFormatter = ({ value }) =>
  <Chip label={
  	value === 'admin' ? 'Admin' : 
  		(value === 'manager' ? 'Manager' : 'User') }
  />;

const PrevilegeEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value ?  value : ''}
    onChange={event => onValueChange(event.target.value.toLowerCase())}
    style={{ width: '100%', marginTop: '4px' }}
  >
    <MenuItem value={'user'}>User</MenuItem>
    <MenuItem value={'manager'}>Manager</MenuItem>
    <MenuItem value={'admin'}>Admin</MenuItem>
  </Select>
);

const PrevilegeTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={PrevilegeFormatter}
    editorComponent={PrevilegeEditor}
    {...props}
  />
);

const PrevilegeFilterCellBase = ({ filter, onFilter, classes }) => (
  <TableCell className={classes.cell} >
    <Input
      className={classes.input}
      type="text"
      value={filter ? filter.value : ''}
      onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
      placeholder="Filter..."
    />
  </TableCell>
);

const PrevilegeFilterCell = withStyles(styles, { name: 'PrivilegeFilterCell' })(PrevilegeFilterCellBase);

const FilterCell = (props) => {
	// console.log("props.column.name: " + props.column.name);
  if (props.column.name === 'privilege' ||
      props.column.name === 'dukeUser') {
    return <PrevilegeFilterCell {...props} />;
  }
  return <TableFilterRow.Cell {...props} />;
};

export default class SampleTable extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			columns: [
      			{ 
      				name: 'username', 
      				title: 'Username',
      				getCellValue: row => (row.username ? row.username : undefined), 
      			},
      			{ 
      				name: 'email', 
      				title: 'E-mail',
      				getCellValue: row => (row.email ? row.email : undefined), 
      			},
      			{ 
      				name: 'privilege', 
      				title: 'Privilege',
      				getCellValue: row => (row.privilege ? row.privilege : undefined),
      				dataType: 'boolean,' 
      			},
            {
              name: 'dukeUser',
              title: 'Duke User',
              getCellValue: row => (row.fromDukeOAuth ? row.fromDukeOAuth : undefined),
              dataType: 'boolean',
            },
      		],
          booleanColumns: ['dukeUser'],
      		privilegeColumns: ['privilege'],
          rows: [],
          //commented out because fetching data remotely
          /*
      		rows: [
      			{ id: 0, username: 'sampleUser', email: 'user@duke.edu', privilege: 'user' }, //id for editing
     			{ id: 1, username: 'sampleManager', email: 'manager@duke.edu', privilege: 'manager' },
      			{ id: 2, username: 'sampleAdmin', email: 'admin@duke.edu', privilege: 'admin'},
      		],
          */
      		sorting: [{ columnName: 'username', direction: 'asc' }],

      		editingColumnExtensions: [
        		{
         			columnName: 'username',
          			createRowChange: (row, value) => ( {...row, username: value} ),
        		},
        		{
          			columnName: 'email',
          			createRowChange: (row, value) => ( {...row, email: value} ),
       			},
        		{
          			columnName: 'privilege',
          			createRowChange: (row, value) => ( {...row, privilege: value} ),
        		},
      		],
      	}

      	this.changeSorting = sorting => this.setState( {sorting} );// for sorting
      	this.commitChanges = this.commitChanges.bind(this); // for editing
	}

	commitChanges({ added, changed, deleted }) { //function for saving changes in table
    let { rows } = this.state;
    console.log("Entered commitChanges()");
    if (added) {
      console.log("entering added");
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
    	console.log("entering changed");
      rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
    }
    if (deleted) {
    	console.log("entering deleted")
      const deletedSet = new Set(deleted);
      rows = rows.filter(row => !deletedSet.has(row.id));
    }
    this.setState({ rows });
  }

  async loadLocalUsers(){
    const sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    const fromDukeOAuth = JSON.parse(sessionStorage.getItem('fromDukeOAuth'));
    console.log("sessionId:" + sessionId);
    console.log("fromDukeOAuth:" + fromDukeOAuth);
    const sessionInfo = utils.createSessionInfoObject(sessionId, fromDukeOAuth);
    console.log("sessionInfo:");
    console.log(sessionInfo);
    const rawUserData = await userInterface.getAllUsersAsync(sessionInfo);
    console.log("rawUserData:");
    console.log(rawUserData);
    if (rawUserData.length == 0){
      return;
    }
    var processedData=[];
    // loop through users
    for (var i = 0; i < rawUserData.length; i++) {
      const currentUser = rawUserData[i];
      console.log("processing user..." );
      console.log(currentUser);
    //   var vendorArrayString = "";
    //   //loop through vendor
      
    //   var formatVendorsArray = new Array();
    //   for (var j=0; j<rawData[i].vendors.length; j++){
    //     //var vendorName = this.state.idToNameMap.get(rawData[i].vendors[j].codeUnique);
    //     var vendorName = rawData[i].vendors[j].vendorName;
    //     var price = rawData[i].vendors[j].price;

    //     var vendorObject = new Object();
    //     vendorObject.vendorName = vendorName;
    //     vendorObject.price = price;
    //     formatVendorsArray.push(vendorObject);

    //     console.log(vendorName);
    //     vendorArrayString+=vendorName + " / $" + rawData[i].vendors[j].price;
    //     console.log("tired");
    //     console.log(i);
    //      if(i!= (rawData[i].vendors.length-1) ){
    //         vendorArrayString+=', ';
    //       }
    //   }

      var singleData = new Object ();
    // match schema for user
      singleData.username = currentUser.username;
      singleData.email = currentUser.email;
      singleData.isAdmin = currentUser.isAdmin;
      singleData.isManager = currentUser.isManager;
      singleData.fromDukeOAuth = currentUser.fromDukeOAuth;
      singleData.loggedIn = currentUser.loggedIn;
      singleData.userId = currentUser._id;
      console.log("packaged user");
      console.log(singleData);
      processedData.push(singleData);
    //   singleData.moneySpent = rawData[i].moneySpent;
    //   singleData.moneyProd = rawData[i].moneyProd;
    //   //singleData.vendorsArray = "";
    //   singleData.vendors = vendorArrayString;
    //   console.log("my id");
    //   singleData.ingredientId = rawData[i]._id;
    //   console.log(singleData.ingredientId);
    //   processedData.push(singleData);
    };

    var finalData = [...processedData.map((row, index)=> ({
        id: index,...row,
      })),
    ];

    console.log("Finished Processing All Data:");
    console.log(finalData);
    this.setState({rows: finalData});

    // console.log("loadAllIngredients()");
    // console.log(finalData);
  };

  componentDidMount(){
    this.loadLocalUsers();
  }

	render() {
		const { rows, columns, sorting, editingColumnExtensions, 
      privilegeColumns, booleanColumns } = this.state;
		return(
			<Paper>
			<Grid
				rows={rows}
				columns={columns}
				getRowId={getRowId}
			>
				<FilteringState defaultFilters={[]} />
				<IntegratedFiltering />
				<SortingState
					sorting={sorting}
					onSortingChange={this.changeSorting}
				/>
				<IntegratedSorting />
        <BooleanTypeProvider
          for={booleanColumns}
        />
				<PrevilegeTypeProvider
					for={privilegeColumns}
				/>
				<EditingState
            		columnExtensions={editingColumnExtensions}
            		onCommitChanges={this.commitChanges}
          		/>
				<Table />
				<TableHeaderRow showSortingControls />
				<TableFilterRow 
					cellComponent={FilterCell}
				/> 
				<TableEditRow />
          		<TableEditColumn showAddCommand showEditCommand showDeleteCommand />
			</Grid>
			</Paper>
		);
	}
}
