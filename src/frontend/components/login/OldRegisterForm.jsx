import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'material-ui/Card';
import CardText from 'material-ui/Card';
import Button from 'material-ui/Button';
import Check from 'material-ui/Button';
import TextField from 'material-ui/TextField';

import { withStyles } from 'material-ui/styles';
import MenuItem from 'material-ui/Menu/MenuItem';
import RaisedButton from 'material-ui/Button';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
      buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 5
    }
});


const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit} className="container">
      <h2 className="card-heading">Sign Up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          hintText="Hint Text"
          label="Userame"
          name="username"
          errorText={errors.username}
          onChange={onChange}
          value={user.username}
          margin="normal"
        />
      </div>

      <div className="field-line">
        <TextField
          label="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
          margin="normal"
        />
      </div>

      <div className="field-line">
        <TextField
          label="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
          margin="normal"
        />
      </div>

      {/* TODO: add checkbox for isAdmin  */}
      <div style={styles.buttons}>
        <RaisedButton raised color = "secondary"
          component = {Link} to = "/">CANCEL</RaisedButton>
        <RaisedButton raised
          color="primary"
          // component = {Link} to = "/vendors" //commented out because it overrides onSubmit
          style={styles.saveButton}
          type="Submit"
          primary="true"> Create </RaisedButton>
      </div>

    </form>
  </Card>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;