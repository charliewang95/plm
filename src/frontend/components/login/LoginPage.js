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
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import AppBar from 'material-ui/AppBar';

import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';

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
      width: 500,
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 50
    },
    media: {
      height: 200,
      width: 500,
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
      showPassword: false
      }
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleClickShowPasssword = this.handleClickShowPasssword.bind(this);
    this.registerOnClick = this.registerOnClick.bind(this);
  }

   handleClickShowPasssword(){
    this.setState({ showPassword: !this.state.showPassword });
  };

    handleMouseDownPassword(event){
    event.preventDefault();
  };

  registerOnClick(e){
    e.preventDefault();
    console.log("clicked");
    alert("There is no register button. Please ask your admin to create an account for you.");
  }

handleMouseDownPassword(event){
    event.preventDefault();
  };

  handleClickShowPasssword(){
    this.setState({ showPassword: !this.state.showPassword });
  };

  onFormSubmit(e) {
    console.log("SUBMIT");
    console.log("username " + this.state.username);
    console.log("password " + this.state.password);
    // TODO: Send data to the back end

    e.preventDefault()
    this.setState({ fireRedirect: true });
    }

  async handleLogin(e){
    console.log("I was fired");
    var res;
    var message = "";
    e.preventDefault();
    var temp = this;
    userActions.authenticateAsync(this.state.username, this.state.password, function(res){
        console.log(res);
        if (res.status == 400) {
            message = res.data;
            alert(message);
            localStorage.removeItem('user');
        } else {
            console.log(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            console.log("hi" + JSON.parse(localStorage.getItem('user')).isAdmin);
            var isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
            temp.props.login(isAdmin, res.data);
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
            <AppBar style={{height:60}}>
              <Typography style={{marginTop: 'auto', marginBottom: 'auto', textAlign:'center'}} type="title" color="inherit" noWrap>
                Real Producers
              </Typography>
          </AppBar>
            <Card style={styles.paper}>
            <CardMedia
          style={styles.media}
          image="https://t3.ftcdn.net/jpg/01/27/38/98/240_F_127389862_pMUoWAQMoKsq6QOrF8kq8S9KaXOCjlHP.jpg"
        />
            <form style={{width: 500}} onSubmit={this.onFormSubmit}>
                <TextField
                    required
                    fullWidth={true}
                    label="Username"
                    value={this.state.username}
                    onChange = {(event) => this.setState({ username: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />

                <FormControl fullWidth required>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    name="password"
                    label="Password"
                    
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={this.state.password}
                    onChange={(event) => this.setState({ password: event.target.value})}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickShowPasssword}
                          onMouseDown={this.handleMouseDownPassword}
                        >
                          {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                        }
                      />
               </FormControl>

              <div style={styles.buttons}>

                  <RaisedButton raised color = "secondary" onClick={this.handleLogin}
                   primary="true" type="Submit" >LOGIN</RaisedButton>


             </div>
           </form>
           </Card>
         </div>

    )
	}
};
/*
                <TextField
                    required
                    fullWidth={true}
                    id="adornment-password"
                    label="Password"
                    value={this.state.password}
                    onChange = {(event) => this.setState({ password: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />
                */

export default LoginPage;
