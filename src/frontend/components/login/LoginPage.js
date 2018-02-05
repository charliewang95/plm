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
  		freezer: '',
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
    console.log("freezer " + this.state.freezer);
    console.log("refrigerator " + this.state.refrigerator);
    console.log("warehouse " + this.state.warehouse);
    // TODO: Send data to the back end

    e.preventDefault()
    this.setState({ fireRedirect: true });
    }

  handleLogin(){
    console.log("I was fired");
    this.props.login(true);
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
                    value={this.state.freezer}
                    onChange = {(event) => this.setState({ freezer: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />
                <TextField
                    required
                    fullWidth={true}
                    id="refrigerator"
                    label="Password"
                    value={this.state.Refrigerator}
                    onChange = {(event) => this.setState({ refrigerator: event.target.value})}
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
           {fireRedirect && (
             <Redirect to={'/storage'}/>
           )}
         </div>

    )
	}
};


export default LoginPage;
