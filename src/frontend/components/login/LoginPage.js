import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import LoginForm from './LoginForm';
import { authenticateAsync } from '../../interface/userInterface.js';

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
        this.processForm = this.processForm.bind(this);
        this.changeUser = this.changeUser.bind(this);
    }

    processForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();
        console.log('user trying to log in');
        console.log(this.state.user);

        authenticateAsync(this.state.email, this.state.password);

        if (true) {
            this.setState({
              errors: {}
            });
        }
        else {
        }
    }

    changeUser(event) {
        const field = event.target.name;
        const user = this.state.user;
        user[field] = event.target.value;
        console.log(user);
        this.setState({
          user
        });
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