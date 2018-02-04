import React from 'react';
import PropTypes from 'prop-types';
import RegisterForm from './RegisterForm.jsx';
import { addUser } from '../../interface/userInterface.js';

class RegisterPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        username: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

//        var str = JSON.stringify(this.state.user);
//        str = str.slice(0,-1) + ', "isAdmin": true, '+'"loggedIn":false'+'}';
//        var user = JSON.parse(str);
//        console.log(user);

        addUser(this.state.user.email, this.state.user.username, this.state.user.password, false, false, '5a63be959144b37a6136491e');
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    console.log(user);
    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <RegisterForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

RegisterPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RegisterPage;
