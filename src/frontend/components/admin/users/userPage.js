// userPage.js

import React from 'react';
import PropTypes from 'prop-types';
import { addLocalUser, addDukeUser } from '../../../interface/userInterface.js';

import * as testConfig from '../../../../resources/testConfig.js'

import ExpansionPanelExample from './ExpansionPanelExample'

// TODO: get session Id from the user
var sessionId = "";
// const sessionId = testConfig.sessionId;
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

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
        password: '',
        privilege: 'user',
        fromDukeOAuth: false,
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.userSuccessfullyAdded = this.userSuccessfullyAdded.bind(this);
  }

  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
  }

  userSuccessfullyAdded() {
    alert('User ' + this.state.user.username + ' is added successfully');
  }


  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    console.log("Creating user...");
    const userInfo = this.state.user;
    console.log(userInfo);
//        var str = JSON.stringify(this.state.user);
//        str = str.slice(0,-1) + ', "isAdmin": true, '+'"loggedIn":false'+'}';
//        var user = JSON.parse(str);
//        console.log(user);
    // this.clearFields();
    // console.log("Creating user with the following information: " + JSON.stringify(this.state.user));
    var me = this;
    var isAdmin = false;
    var isManager = false;
    const privilegeLevel = userInfo.privilege.toLowerCase();
    if ( privilegeLevel === 'admin'){
      isAdmin = true;
      isManager = true;
    } else if (privilegeLevel === 'manager' ){
      isManager = true
    }
    if (userInfo.fromDukeOAuth){
      addDukeUser(userInfo.username, userInfo.email, isAdmin, isManager, sessionId, 
        (res)=>
        {
          if (res.status == 400) {
            alert(res.data);
          } else if (res.status == 500) {
            alert('Username or email already exists');
          }else{
            me.userSuccessfullyAdded();
            this.clearFields();
          }
        }
      );
    } else {
      addLocalUser(userInfo.username, userInfo.password, userInfo.email, isAdmin, isManager, sessionId, 
        (res)=>
        {
          if (res.status == 400) {
            alert(res.data);
          } else if (res.status == 500) {
            alert('Username or email already exists');
          }else{
            me.userSuccessfullyAdded();
            this.clearFields();
          }
        }
      );
    }

  }

  clearFields(){
    this.setState(
      {
        user:{
          ...this.state.user, 
          email:"",
          username:"",
          password:"",
          privilege:"user",
          fromDukeOAuth:false
        }
      }
    );
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    console.log("field is " + field);
    const user = this.state.user;
    console.log("user before change is " + JSON.stringify(user));
    if (field === "fromDukeOAuth"){
      user[field] = event.target.checked;
    } else{
      user[field] = event.target.value;
    }
    
    
    console.log("Changed user[" + field +"] to " + user[field]);
    console.log(user);
    this.setState({
      user
    });
    console.log("user after change is " + JSON.stringify(user));
  }

  /**
   * Render the component.
   */
  render() {
    return (
      <div>
        <ExpansionPanelExample
          onFormSubmit={this.processForm}
          onFormChange={this.changeUser}
          formErrors={this.state.errors}
          formUser={this.state.user}
        />

        
      </div>
    );
  }

}

RegisterPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default RegisterPage;
