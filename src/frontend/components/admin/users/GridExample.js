// GridExample.js
import React from 'react';
import { render } from 'react-dom';
import Paper from 'material-ui/Paper';
import {
  // State or Local Processing Plugins
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';


const App = () => (
  <Grid
    rows={[
      { username: 'sampleUser', email: 'user@duke.edu', privelege: 'user' },
      { username: 'sampleManager', email: 'manager@duke.edu', privelege: 'manager' },
      { username: 'sampleAdmin', email: 'admin@duke.edu', privelege: 'admin'}
    ]}
    columns={[
      { name: 'username', title: 'Username' },
      { name: 'email', title: 'E-mail' },
      { name: 'privelege', title: 'Privelege' },
    ]}>
    <Table />
    <TableHeaderRow />
  </Grid>
);

export default App;