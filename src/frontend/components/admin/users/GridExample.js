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

const getRowId = row => row.id;
//for previleges
const PrevilegeFormatter = ({ value }) =>
  <Chip label={
  	value === 'admin' ? 'Admin' : 
  		(value === 'manager' ? 'Manager' : 'User') }
  />;

const PrevilegeEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value}
    onChange={event => onValueChange(event.target.value.toLowerCase())}
    style={{ width: '100%', marginTop: '4px' }}
  >
    <MenuItem value='user'>User</MenuItem>
    <MenuItem value='manager'>Manager</MenuItem>
    <MenuItem value='admin'>Admin</MenuItem>
  </Select>
);

const PrevilegeTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={PrevilegeFormatter}
    editorComponent={PrevilegeEditor}
    {...props}
  />
);

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
      				name: 'privelege', 
      				title: 'Privelege',
      				getCellValue: row => (row.privelege ? row.privelege : undefined),
      				dataType: 'string' 
      			},
      		],

      		privelegeColumns: ['privelege'],

      		rows: [
      			{ id: 0, username: 'sampleUser', email: 'user@duke.edu', privelege: 'user' }, //id for editing
     			{ id: 1, username: 'sampleManager', email: 'manager@duke.edu', privelege: 'manager' },
      			{ id: 2, username: 'sampleAdmin', email: 'admin@duke.edu', privelege: 'admin'},
      		],

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
          			columnName: 'privelege',
          			createRowChange: (row, value) => ( {...row, privelege: value} ),
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

	render() {
		const { rows, columns, sorting, editingColumnExtensions, privelegeColumns } = this.state;
		return(
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
				<PrevilegeTypeProvider
					for={privelegeColumns}
				/>
				<EditingState
            		columnExtensions={editingColumnExtensions}
            		onCommitChanges={this.commitChanges}
          		/>
				<Table />
				<TableHeaderRow showSortingControls />
				<TableFilterRow /> 
				<TableEditRow />
          		<TableEditColumn showAddCommand showEditCommand showDeleteCommand />
			</Grid>
		);
	}
}
// const App = () => (
//   <Grid
//     rows={[
//       { username: 'sampleUser', email: 'user@duke.edu', privelege: 'user' },
//       { username: 'sampleManager', email: 'manager@duke.edu', privelege: 'manager' },
//       { username: 'sampleAdmin', email: 'admin@duke.edu', privelege: 'admin'}
//     ]}
//     columns={[
//       { name: 'username', title: 'Username' },
//       { name: 'email', title: 'E-mail' },
//       { name: 'privelege', title: 'Privelege' },
//     ]}>
//     <Table />
//     <TableHeaderRow />
//   </Grid>
// );

// export default App;