import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'material-ui/Card';
import CardText from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';

const LoginForm = ({
    onSubmit,
    onChange,
    errors,
    successMessage,
    user,
    toggleAuthenticateStatus
}) => (
    <div>
        <Card>
            <FormControl error={errors.summary}>
                <TextField value={user.email} />
                <InputLabel>Email or Username</InputLabel>
                <Input value={user.email} onChange={onChange}/>
            </FormControl>
            <FormControl error={errors.summary}>
                <InputLabel>Password</InputLabel>
                <Input value={user.password} onChange={onChange}/>
            </FormControl>
            <Button variant="raised" onClick={onSubmit}>Login</Button>
            <CardText>Don't have an account? Yes, there's no register button here. I know it sucks, but please ask your administrator to create one for you.</CardText>
        </Card>
    </div>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;