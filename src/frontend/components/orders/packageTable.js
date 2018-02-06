import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

const styles = theme => ({
  root: {
    width: '36%',
    //marginTop: theme.spacing.unit * 3,
    //overflowX: 'auto',
  },
  table: {
    width: 500,
  },
});

let id = 0;
function createData(packageName, weight) {
  id += 1;
  return {packageName,weight};
}

const data = [
  createData('Sack', 50),
  createData('Pail', 50),
  createData('Drum', 500),
  createData('Supersack', 2000),
  createData('Truckload', 50000),
  createData('Railcar', 280000),
];

function SimpleTable(props) {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell> Package Name </TableCell>
            <TableCell> Weight (lbs) </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(n => {
            return (
              <TableRow key={n.id}>
                <TableCell>{n.packageName}</TableCell>
                <TableCell>{n.weight}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);