import React from 'react';
import propTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 5
    }
  };

  const required = (value) => {
  if (!value.toString().trim().length) {
    // We can return string or jsx as the 'error' prop for the validated Component
    return 'require';
  }
};

class EditStorageCapacityForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
  		freezer: '',
  		value:undefined,
      refrigerator:'',
      warehouse:'',
      }
    // this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    console.log("SUBMIT");
    console.log("freezer " + this.state.freezer);
    console.log("refrigerator " + this.state.refrigerator);
    console.log("warehouse " + this.state.warehouse);
    // TODO: Send data to the back end

    e.preventDefault()

    }


  render (){
    const { name, contact, code } = this.state;
    return (
            <div>
              <label> Edit Storage Capacity </label>

            <form onSubmit={this.onFormSubmit}>
                <TextField
                    fullWidth={true}
                    id="freezer"
                    label="Freezer"
                    value={this.state.freezer}
                    onChange = {(event) => this.setState({ freezer: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />
                <TextField
                    fullWidth={true}
                    id="refrigerator"
                    label="Refrigerator"
                    value={this.state.Refrigerator}
                    onChange = {(event) => this.setState({ refrigerator: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />
                <TextField
                    fullWidth={true}
                    id="warehouse"
                    label="Warehouse"
                    value={this.state.warehouse}
                    onChange = {(event) => this.setState({ warehouse: event.target.value})}
                    margin="normal"
                    validations={[required]}
                />
              <div style={styles.buttons}>
                  <RaisedButton raised color = "secondary"
                    component = {Link} to = "/storage">CANCEL</RaisedButton>
                  <RaisedButton raised
                            component = {Link} to = "/storage"
                            color="primary"
                            style={styles.saveButton}
                            type="Submit"
                            primary={true}> SAVE </RaisedButton>

             </div>
           </form>
         </div>

    )
	}
};


export default EditStorageCapacityForm;
