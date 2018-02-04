import React from 'react';
import propTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';
import {Card,CardHeader} from 'material-ui/Card';
import * as vendorActions from '../../interface/vendorInterface.js';

import { Redirect } from 'react-router'
import * as testConfig from '../../../resources/testConfig.js'

// TODO: get session Id from the user
const sessionId = testConfig.sessionId;
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 5
    }
  };

class AddVendorForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
  		name: '',
  		value:undefined,
      contact:'',
      code:'',
      fireRedirect: false
      }
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    console.log("SUBMIT");
    console.log("name " + this.state.name);
    console.log("contact " + this.state.code);
    console.log("code " + this.state.contact);

    // TODO: Send data to the back end
    vendorActions.addVendor(
      this.state.name,this.state.contact,this.state.code,sessionId);
    e.preventDefault()
    this.setState({ fireRedirect: true });
    }


  render (){
    const { name, contact, code, fireRedirect } = this.state;
    return (
            <div>
              <label> Add a Vendor </label>

            <form onSubmit={this.onFormSubmit}>
                <TextField
                    fullWidth={true}
                    id="name"
                    label="Name"
                    value={this.state.name}
                    onChange = {(event) => this.setState({ name: event.target.value})}
                    margin="normal"
                />
                <TextField
                    fullWidth={true}
                    id="contact"
                    label="Contact"
                    value={this.state.contact}
                    onChange = {(event) => this.setState({ contact: event.target.value})}
                    margin="normal"
                />
                <TextField
                    fullWidth={true}
                    id="code"
                    label="Code"
                    value={this.state.code}
                    onChange = {(event) => this.setState({ code: event.target.value})}
                    margin="normal"
                />
              <div style={styles.buttons}>
                  <RaisedButton raised color = "secondary"
                    component = {Link} to = "/vendors">CANCEL</RaisedButton>
                  <RaisedButton raised
                            color="primary"
                            // component = {Link} to = "/vendors" //commented out because it overrides onSubmit
                            style={styles.saveButton}
                            type="Submit"
                            primary="true"> SAVE </RaisedButton>
             </div>
           </form>
           {fireRedirect && (
             <Redirect to={'/vendors'}/>
           )}
         </div>
    )
	}
};


export default AddVendorForm;
