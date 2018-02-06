import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';
import {Card,CardHeader} from 'material-ui/Card';

const styles = {
  buttons: {
    marginTop: 30,
    float: 'center'
  },
  saveButton: {
    marginLeft: 5
  }
};

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user
}) => (
  <div>
    <label> Create a User </label>
    {errors.summary && <p className="error-message">{errors.summary}</p>}
      
    <form action = "/" onSubmit={onSubmit}>

      <TextField
        required
        fullWidth={true}
        id="username"
        name='username'
        label="Username"
        value={user.username}
        onChange={onChange}
        margin="normal"
      />
      <TextField
        required
        fullWidth={true}
        id="email"
        name="email"
        label="E-mail"
        value={user.email}
        onChange = {onChange}
        margin="normal"
      />
      <TextField
        required
        fullWidth={true}
        id="password"
        name="password"
        label="Password"
        value={user.password}
        onChange = {onChange}
        margin="normal"
      />
      <div style={styles.buttons}>
        <RaisedButton raised color = "secondary"
          component = {Link} to = "/">Back To Dashboard</RaisedButton>
         <RaisedButton raised
          color="primary"
          style={styles.saveButton}
          type="Submit"
          primary="true"> Add </RaisedButton>
      </div>
    </form>
  </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
