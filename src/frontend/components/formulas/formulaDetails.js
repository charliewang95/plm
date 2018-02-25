import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import Chip from 'material-ui/Chip';
import * as ingredientInterface from '../../interface/ingredientInterface';
import SelectIngredients from './SelectIngredients';

import {ingredientData} from '../shoppingCart/dummyData';

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 50,
    },
    packageName:{
      marginLeft: 10,
      float: 'center',
      width: 100,
    },
    unitsProvided:{
      width: 100,
    },
    formControl: {
      width: 400
    }
  };

var sessionId = "";
var userId = "";

class FormulaDetails extends React.Component{
  constructor(props) {
    super(props);
    var dummyObject = new Object();
    const details = (props.location.state.details)?(props.location.state.details):dummyObject;
    console.log(details);
    const isCreateNew = props.location.state.isCreateNew;
    this.state = {
      ingredientsString:"",
      ingredientsArray: (details.ingredientsArray)?(details.ingredientsArray):[],
  		value:undefined,
      formulaId: (details._id)?(details.ingredientId):'',
      name:(details.name)?(details.name):'',
      description:(details.description)?(details.description):'',
      unitsProvided:(details.unitsProvided)?(details.unitsProvided):0,
      ingredients: (details.ingredients)?(details.ingredients):'',
      multi : 'false',
      isDisabled: (isCreateNew) ? false: true,
      isCreateNew: (isCreateNew),
      }

    this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.updateIngredients = this.updateIngredients.bind(this);
    this.computeIngredientsString = this.computeIngredientsString.bind(this);
    this.isValid = this.isValid.bind(this);
    this.handleUnitsProvidedChange = this.handleUnitsProvidedChange.bind(this);
    this.loadAllIngredients = this.loadAllIngredients.bind(this);
  }

  // componentWillMount(){
  //   this.loadAllIngredients();
  // }

  componentDidMount(){
    // sessionId = JSON.parse(localStorage.getItem('user'))._id;
    console.log(" Create NEW " + this.state.isCreateNew);
    if(this.state.isCreateNew){
      this.loadAllIngredients();
    }
    this.computeIngredientsString();
  }


   async loadAllIngredients(){
    sessionId = '5a8b99a669b5a9637e9cc3bb';
    userId = '5a8b99a669b5a9637e9cc3bb';

    var allIngredients = [];
    // TODO: Connect with back end and get data
    // allIngredients = await ingredientInterface.getAllIngredientNamesAsync(sessionId);
    allIngredients = ingredientData;
    // console.log(" All Ingredients " + JSON.stringify(allIngredients));
      var formatIngredientsArray =  new Array();

      for (var i=0; i<allIngredients.length; i++){
        //var vendorName = this.state.idToNameMap.get(rawData[i].vendors[j].codeUnique);
        var ingredientName = allIngredients[i].name;
        var ingredientObj = new Object();
        ingredientObj.ingredientName = ingredientName;
        ingredientObj.quantity = 0;
        formatIngredientsArray.push(ingredientObj);
      }
      console.log(formatIngredientsArray);
    this.setState({ingredientsArray: formatIngredientsArray});
    this.setState({ingredientsString: "blablabla"});
      console.log(this.state);
    this.computeIngredientsString();
    // console.log(" String " + )
  }

  handleOnChange (option) {
    console.log("CHANGE ");
  		const {multi} = this.state;
  		if (multi) {
  			this.setState({ingredients: option});
  		} else {
  			this.setState({value:option});
  		};
  	};

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  };

  updateIngredients(updatedArray){
    this.setState({'ingredientsArray': updatedArray});
  }

  computeIngredientsString(){
    console.log(" Ingredients Array " + JSON.stringify(this.state.ingredientsArray));
    var ingredients_string = "";
    console.log(this.state.ingredientsArray);
    for(var i =0; i < this.state.ingredientsArray.length; i++){
          var ingredient = this.state.ingredientsArray[i];
          //var vendorName = this.state.idToNameMap.get(vendorObject.codeUnique);
          ingredients_string += ingredient.ingredientName + " / " + ingredient.quantity;
          if(i!= (this.state.ingredientsArray.length - 1)){
            ingredients_string+=', ';
          }
        }
    this.setState({ingredientsString: ingredients_string });
  }



  isValid(){
    const re =/^[1-9]\d*$/;
    if(!this.state.name){
      alert(" Please enter the formula name. ");
    }else if (!this.state.description){
      alert(" Please enter the description. ");
    }else if (!re.test(this.state.unitsProvided)) {
      alert(" Units of product of formula must be a positive integer. ");
    }else if (this.state.ingredientsArray.length==0){
      alert(" Please add ingredients needed for the formula.")

    }else if (this.state.ingredientsArray.length){
      // loop through and make sure all ingredients have quantities updated
      for(var i =0; i < this.state.ingredientsArray.length;i++){
        if(!this.state.ingredientsArray[i].quantity){
          alert(" Please add a positive integer quantity for ingredient " + this.state.ingredientsArray[i].ingredientName);
        }
      }
    }else
      return true;
  }

  onFormSubmit(e) {
    e.preventDefault();

    if(this.isValid() && this.state.isCreateNew){
      console.log(" Add Formula ");
      // TODO: Add formula in back end

    }else if (this.isValid()){
      console.log(" UPDATE FORMULA ");
      // TODO: Update Formula
    }
      // Call function to send data to backend

    }

    handleNewOptionClick(option){
      console.log("New Option was clicked: " + option.value);
  }

  handleUnitsProvidedChange(event){
    const re = /^[0-9\b]+$/;
      if ( event.target.value == '' || (event.target.value>=0 && re.test(event.target.value))) {
         this.setState({unitsProvided: event.target.value})
      }else{
        alert("The units of product must be a positive integer. ");
      }
  }

  render (){
    const { name, description, unitsProvided, ingredients } = this.state;
    return (
      // <PageBase title = 'Add Ingredients' navigation = '/Application Form'>
      <form onSubmit={this.onFormSubmit} style={styles.formControl}>
        <p><font size="6">Basic Information</font></p>
        {/* {(this.state.numUnit!=0)? <Chip label="In Stock"/> : ''} */}
          <FormGroup>
            <TextField
              disabled = {this.state.isDisabled}
              id="name"
              label="Formula Name"
              value={this.state.name}
              onChange={this.handleChange('name')}
              margin="normal"
              required
            />
            </FormGroup>
            <TextField
              id="unitsProvided"
              label="Product Units"
              value={this.state.unitsProvided}
              onChange={(event)=>this.handleUnitsProvidedChange(event)}
              margin="normal"
              disabled = {this.state.isDisabled}
              style={styles.quantity}
              required
            />
            <TextField
              id="nativeUnit"
              label="Native Units"
              value={this.state.nativeUnit}
              onChange={this.handleChange('nativeUnit')}
              margin="normal"
              disabled = {this.state.isDisabled}
              style={styles.unitsProvided}
              required
            />
            <FormGroup>
            {this.state.isDisabled && <TextField
              id="selectIngredients"
              label="Ingredients"
              value={this.state.ingredientsString}
              margin="normal"
              disabled = {this.state.isDisabled}
              required
            />}
            {(!this.state.isDisabled) && <SelectIngredients initialArray={this.state.ingredientsArray} handleChange={this.updateIngredients}/>}
            </FormGroup>
              <div style={styles.buttons}>
                {(this.state.isDisabled) && <RaisedButton raised color = "secondary" onClick={()=>{this.setState({isDisabled:false});}} >EDIT</RaisedButton>}
                {(!this.state.isDisabled) && <RaisedButton raised
                          color="primary"
                          // className=classes.button
                          style={styles.saveButton}
                          type="Submit"
                          primary="true"> {(this.state.isCreateNew)? 'ADD' : 'SAVE'} </RaisedButton>}
                <RaisedButton color="default"
                  component={Link} to='/formula'
                  style = {{marginTop: 5, marginLeft: 5}}
                  > BACK </RaisedButton>
             </div>
           </form>
    )
	}
};


export default FormulaDetails;
