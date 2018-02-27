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
import * as ingredientActions from '../../interface/ingredientInterface';
import * as formulaActions from '../../interface/formulaInterface';
import SelectIngredients from './SelectIngredients';


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
      width: 120,
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
      formulaId: (details.formulaId)?(details.formulaId):'',
      name:(details.name)?(details.name):'',
      description:(details.description)?(details.description):'',
      unitsProvided:(details.unitsProvided)?(details.unitsProvided):'',
      ingredients: (details.ingredients)?(details.ingredients):'',
      multi : 'false',
      isDisabled: (isCreateNew) ? false: true,
      isCreateNew: (isCreateNew),
      isValid: false,
      }

    this.handleOnChange = this.handleOnChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.updateIngredients = this.updateIngredients.bind(this);
    this.computeIngredientsString = this.computeIngredientsString.bind(this);
    this.handleUnitsProvidedChange = this.handleUnitsProvidedChange.bind(this);
    this.isValid = this.isValid.bind(this);

    }

  componentWillMount(){
    // this.loadAllIngredients();

  }

  componentDidMount(){
    this.computeIngredientsString();
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
          ingredients_string += ingredient.ingredientName + " / " + ingredient.quantity + ingredient.nativeUnit;
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
      return false;
    }else if (!this.state.description){
      alert(" Please enter the description. ");
      return false;
    }else if (!re.test(this.state.unitsProvided)) {
      alert(" Units of product of formula must be a positive integer. ");
      return false;
    }else if (this.state.ingredientsArray.length==0){
      alert(" Please add ingredients needed for the formula.");
      return false;
    }else if (this.state.ingredientsArray.length){
      // loop through and make sure all ingredients have quantities updated
      for(var i =0; i < this.state.ingredientsArray.length;i++){
        if(!this.state.ingredientsArray[i].quantity){
          alert(" Please add a positive integer quantity for ingredient " + this.state.ingredientsArray[i].ingredientName);
          return false;
        }
      }
      return true;
    }else{
      return true;
    }
  }

  async onFormSubmit(e) {
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;

    e.preventDefault();
    console.log("submit formula ");
    if(this.isValid() && this.state.isCreateNew){


      console.log(" Array " + JSON.stringify(this.state.ingredientsArray));
      //TODO: Check for adding order
      await formulaActions.addFormula(this.state.name, this.state.description,
            this.state.unitsProvided, this.state.ingredientsArray, sessionId, function(res){
              //TODO: Please update the error accordingly
              if(res.status==400){
                alert(res.data);
              }else{
                // TODO: Snackbar
                alert(" Formula successfully added! ");
              }
            });
    }else if (this.isValid()){
      console.log("update formula ");
      console.log(this.state);
      await formulaActions.updateFormula(this.state.formulaId, this.state.name,
        this.state.description,this.state.unitsProvided, this.state.ingredientsArray, sessionId, function(res){
          //TODO: Update error status
          if(res.status == 400){
            alert(res.data);
          }else{
            //TODO: SnackBar
            alert(" Formula successfully updated. ");
          }
        });
    this.setState({isDisabled:true});
    }
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
    const { formulaId,name, description, unitsProvided, ingredients, isCreateNew,isDisabled} = this.state;
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
              required
              id="unitsProvided"
              label="Product Units"
              value={this.state.unitsProvided}
              onChange={(event)=>this.handleUnitsProvidedChange(event)}
              margin="normal"
              disabled = {this.state.isDisabled}

              style={styles.unitsProvided}
            />

            <FormGroup>
              <TextField
                id="description"
                label="Description "
                value={this.state.description}
                onChange={this.handleChange('description')}
                margin="normal"
                disabled = {this.state.isDisabled}
                // style={styles.unitsProvided}
                required
              />
            </FormGroup>

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
                          primary="true"
                          > {(this.state.isCreateNew)? 'ADD' : 'SAVE'} </RaisedButton>}

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
