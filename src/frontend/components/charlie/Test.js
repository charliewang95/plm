import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import LoginForm from './LoginForm';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            successMessage :'',
            user: {
                email: '',
                password: ''
            }
        };
    }

    render() {
        return (
            <LoginForm
                onSubmit={this.processForm}
                onChange={this.changeUser}
                errors={this.state.errors}
                successMessage={this.state.successMessage}
                user={this.state.user}
            />
        );
    }
}

export default Login