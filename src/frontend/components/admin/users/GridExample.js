// GridExample.js
import React from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import {
  FilteringState,
  IntegratedFiltering,
} from '@devexpress/dx-react-grid'; //for filtering
import {
  // State or Local Processing Plugins
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow, // for filtering
} from '@devexpress/dx-react-grid-material-ui';

export default class SampleTable extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			columns: [
      			{ name: 'username', title: 'Username' },
      			{ name: 'email', title: 'E-mail' },
      			{ name: 'privelege', title: 'Privelege' },
      		],
      		rows: [
      			{ username: 'sampleUser', email: 'user@duke.edu', privelege: 'user' },
     			{ username: 'sampleManager', email: 'manager@duke.edu', privelege: 'manager' },
      			{ username: 'sampleAdmin', email: 'admin@duke.edu', privelege: 'admin'},
      		]
      	}
	}

	render() {
		const { rows, columns } = this.state;
		return(
			<Grid
				rows={rows}
				columns={columns}
			>
				<FilteringState defaultFilters={[]} />
				<IntegratedFiltering />
				<Table />
				<TableHeaderRow />
				<TableFilterRow />
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