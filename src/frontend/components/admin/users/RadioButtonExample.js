// RadioButtonExample.js
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';

const styles = theme => ({
  formControl: {
    marginTop: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    display : 'flex',
  },
});

class RadioButtonsGroup extends React.Component {
  state = {
    value: 'user',
  };

  handleChange = (event, value) => {
  	console.log("changing value to " + value);
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
        <FormControl component="fieldset" required className={classes.formControl}>
          <FormLabel component="legend">Privilege</FormLabel>
          <RadioGroup
            aria-label="privilege"
            name="privilege"
            className={classes.group}
            value={this.state.value}
            onChange={this.handleChange}
            row={true}
          >
            <FormControlLabel value="user" control={<Radio />} label="User" />
            <FormControlLabel value="manager" control={<Radio />} label="Manager" />
            <FormControlLabel value="admin" control={<Radio />} label="Admin" />
          </RadioGroup>
        </FormControl>
    );
  }
}

RadioButtonsGroup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RadioButtonsGroup);