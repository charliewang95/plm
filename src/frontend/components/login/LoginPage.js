import React from 'react';
import propTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';

import { Redirect } from 'react-router'
import * as storageActions from '../../interface/storageInterface';
import Typography from 'material-ui/Typography';
import Card, {CardMedia} from 'material-ui/Card';
import { Switch, Route } from 'react-router-dom';
import PersistentDrawer from '../main/PersistentDrawer';
import * as userActions from'../../interface/userInterface';
const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 5
    },
    paper: {
      padding: 50,
    },
    media: {
      height: 200,
    },
  };

  const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return 'require';
  }
};

class LoginPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
  		username:'',
      password:'',
  		value:undefined,
      refrigerator:'',
      warehouse:'',
      fireRedirect: false,
      }
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  onFormSubmit(e) {
    console.log("SUBMIT");
    console.log("username " + this.state.username);
    console.log("password " + this.state.password);
    // TODO: Send data to the back end

    e.preventDefault()
    this.setState({ fireRedirect: true });
    }

  async handleLogin(){
    console.log("I was fired");
    var res;
    var message = "";
    userActions.authenticateAsync(this.state.username, this.state.password, function(res){
        console.log(res);
        if (res.status == 400) {
            message = res.data;
            alert(message);
        } else {
            this.props.login(true, "success");
        }
    });
//    var message = "";
//    var success = false;
//    console.log(res);
//    if(res.username){
//      console.log("Hi");
//      success = true;
//    }else{
//      console.log("I was entered");
//      console.log(res.data);
//      message = "Failed";
//    }
//    this.props.login(success, message);
  }


  render (){
    const { name, contact, code,fireRedirect } = this.state;
    return (
            <div>

            <Card style={styles.paper}>
            <CardMedia
          style={styles.media}
          image="https://t3.ftcdn.net/jpg/01/27/38/98/240_F_127389862_pMUoWAQMoKsq6QOrF8kq8S9KaXOCjlHP.jpg"
        />
            <form onSubmit={this.onFormSubmit}>

                <TextField
                    required
                    fullWidth={true}
                    id="freezer"
                    label="Username"
                    value={this.state.username}
                    onChange = {(event) => this.setState({ username: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />
                <TextField
                    required
                    fullWidth={true}
                    id="refrigerator"
                    label="Password"
                    value={this.state.password}
                    onChange = {(event) => this.setState({ password: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />
              <div style={styles.buttons}>
                  <RaisedButton raised color = "primary"
                    onClick={this.handleLogin} >LOGIN</RaisedButton>
                  <RaisedButton raised
                            // component = {Link} to = "/storage"
                            color="secondary"
                            style={styles.saveButton}
                            type="Submit"
                            primary="true"> REGISTER </RaisedButton>

             </div>
           </form>
           </Card>
         </div>

    )
	}
};


export default LoginPage;
