import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import ReactSelect from 'react-select';
import Styles from  'react-select/dist/react-select.css';


// const styles = theme => ({
//   progressBarCell: {
//     paddingLeft: theme.spacing.unit,
//     paddingRight: theme.spacing.unit,
//   },
//   progressBar: {
//     backgroundColor: theme.palette.primary[300],
//     float: 'left',
//     height: theme.spacing.unit,
//   },
// });

export const ProgressBarCellBase = ({ value, classes, style }) => {
  // const percent = value * 100;
  return (
    <TableCell
      className={classes.multiSelectCell}
      <Select.Creatable
        type = "create"
        multi={false}
        options={ingredient_options}
        onChange={(value) => this.setState({ name: value})}
        value = {name}
      />
    </TableCell>
  );
};

ProgressBarCellBase.propTypes = {
  value: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  style: PropTypes.object,
};
ProgressBarCellBase.defaultProps = {
  style: {},
};

export const ProgressBarCell = withStyles(styles, { name: 'ProgressBarCell' })(ProgressBarCellBase);
