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
  if (props.column.name === 'privilege') {
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
      				dataType: 'string' 
      			},
      		],

      		privilegeColumns: ['privilege'],

      		rows: [
      			{ id: 0, username: 'sampleUser', email: 'user@duke.edu', privilege: 'user' }, //id for editing
     			{ id: 1, username: 'sampleManager', email: 'manager@duke.edu', privilege: 'manager' },
      			{ id: 2, username: 'sampleAdmin', email: 'admin@duke.edu', privilege: 'admin'},
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

	render() {
		const { rows, columns, sorting, editingColumnExtensions, privilegeColumns } = this.state;
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
// const App = () => (
//   <Grid
//     rows={[
//       { username: 'sampleUser', email: 'user@duke.edu', privilege: 'user' },
//       { username: 'sampleManager', email: 'manager@duke.edu', privilege: 'manager' },
//       { username: 'sampleAdmin', email: 'admin@duke.edu', privilege: 'admin'}
//     ]}
//     columns={[
//       { name: 'username', title: 'Username' },
//       { name: 'email', title: 'E-mail' },
//       { name: 'privilege', title: 'privilege' },
//     ]}>
//     <Table />
//     <TableHeaderRow />
//   </Grid>
// );

// export default App;