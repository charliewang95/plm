import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import PageBase from '../home/PageBase/PageBase';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import data from './Data';


/* Replace with the data from the back end */
const ingredient_options = [
    { value: 'salt', label: 'Salt' },
    { value: 'butter', label: 'Butter' },
    { value: 'cabbage', label: 'Cabbage' }
]

/* Replace with the data from the back end -- filtered based on ingredients */
const vendor_options = [
    { value: 'vendor1', label: 'vendor1' },
    { value: 'vendor2', label: 'vendor2' },
    { value: 'vendor3', label: 'vendor3' }
 ]


const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 5
    }
  };


class AddIngredientForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
  		vendors: [],
  		value:undefined,
      name:'',
      pkg:'',
      temperature:'',
      multi : 'false'
      }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  handleOnChange (option) {
    console.log("CHANGE ");
  		const {multi} = this.state;
  		if (multi) {
  			this.setState({vendors: option});
  		} else {
  			this.setState({value:option});
  		};
  	};

  onFormSubmit(e) {
    // console.log("SUBMIT");
    console.log(" name " + this.state.name.value);
    console.log(" Package " + this.state.pkg.value);
    console.log(" temp " + this.state.temperature.value);
    console.log("vendors " + this.state.vendors);

    // Convert vendors from an object into an array to store in the database
    const vendorsArray = [];
    var counter = 0;

    for (var key in this.state.vendors) {
      vendorsArray[counter]=this.state.vendors[key].value;
      counter++;
    }
      e.preventDefault()

      // Call function to send data to backend

    }

    handleNewOptionClick(option){
      console.log("New Option was clicked: " + option.value);
    }

  render (){
    const { name, pkg, temperature, vendors } = this.state;
    return (<PageBase title = 'Add Ingredients' navigation = '/Application Form'>
            <form onSubmit={this.onFormSubmit}>
              <div style = {styles.buttons}>
                <label> Ingredient Name </label>
                <Select.Creatable
                  type = "create"
        					multi={false}
        					options={ingredient_options}
        					onChange={(value) => this.setState({ name: value})}
                  value = {name}
                />
              </div>
              <div style = {styles.buttons}>
                <label> Package </label>
                <Select
                  // type = "create"
                  multi={true}
                  options={data.package_options}
                  onChange={(value) => this.setState({pkg: value})}
                  value = {pkg}/>
              </div>
              <div style = {styles.buttons}>
                <label> Temperature </label>
                <Select
                  // type = "create"
                  multi={false}
                  value = {temperature}
                  options={data.temperature_options}
                  onChange={(value)=> this.setState({temperature: value})}/>
              </div>
              <div style = {styles.buttons}>
                <label> Vendors </label>
                <Select.Creatable
                  // type = "create"
                  multi={true}
                  joinValues = {true}
                  options={vendor_options}
                  // onNewOptionClick= {(option)=> this.handleNewOptionClick(option)}
                  onChange={(option) => this.handleOnChange(option)}
                  value = {vendors}
                  />
              </div>
              <div style={styles.buttons}>
                {/* <Link to="/"> */}
                  <RaisedButton raised color = "secondary" >CANCEL</RaisedButton>
                {/* </Link> */}
                <RaisedButton raised
                          color="primary"
                          // className=classes.button
                          style={styles.saveButton}
                          type="Submit"
                          primary={true}> SAVE </RaisedButton>
             </div>
           </form>
         </PageBase>
    )
	}
};

// AddIngredientFormOld.propTypes = {
//   hint: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired
// };

export default AddIngredientForm;
