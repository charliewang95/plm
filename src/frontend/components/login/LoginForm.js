import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from 'material-ui/Card';
import CardText from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Style from './styleLogin.css';
import { withStyles } from 'material-ui/styles';

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
            <form action="/" onSubmit={onSubmit}>
                <h2 className="card-heading">Login</h2>

                {successMessage && <p className="success-message">{successMessage}</p>}
                {errors.summary && <p className="error-message">{errors.summary}</p>}
                <div> email </div>
                <div className="field-line">

                    <TextField
                        floatingLabelText="Email"
                        name="email"
                        errorText={errors.email}
                        onChange={onChange}
                        value={user.email}
                    />
                </div>

                <div> password </div>
                <div className="field-line">
                    <TextField
                        floatinglabeltext="Password"
                        type="password"
                        name="password"
                        onChange={onChange}
                        errorText={errors.password}
                        value={user.password}
                    />
                </div>

                <div className="button-line">
                    <Button type="submit" label="Log in" primary>Log In</Button>
                </div>

                <CardText>Don't have an account? Yes, there's no register button here. I know it sucks, but please ask your administrator to create one for you.</CardText>
            </form>
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

export default withStyles(Style)(LoginForm);