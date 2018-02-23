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
	EditingState,
} from '@devexpress/dx-react-grid'; // for editing
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow, // for filtering
  TableEditRow, //for editing
  TableEditColumn, //for editing
} from '@devexpress/dx-react-grid-material-ui';

const getRowId = row => row.id;

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
      			},
      		],

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
		const { rows, columns, sorting, editingColumnExtensions } = this.state;
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