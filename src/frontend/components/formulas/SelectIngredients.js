import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import IngredientItem from './IngredientItem';
import * as ingredientActions from '../../interface/ingredientInterface.js';
import * as testConfig from '../../../resources/testConfig.js';

//const VENDORS = require('./dummyIngredients');


// TODO: get session Id from the user
//const sessionId = testConfig.sessionId;
const sessionId = '5a63be959144b37a6136491e';
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


class SelectIngredients extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectName: "",
      inputPrice: 0,
      options: [],
      ingredientsArray: this.props.initialArray,
      idToNameMap: {}, //id = key, name=value
    };
    this.updateId = this.updateId.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.loadIngredientsArray = this.loadIngredientsArray.bind(this);
    this.loadCodeNameArray = this.loadCodeNameArray.bind(this);
//    this.createMap = this.createMap.bind(this);
    this.resetArray = this.resetArray.bind(this);
  }

  componentWillMount(){
    //this.loadCodeNameArray();
    this.loadIngredientsArray();
  //  this.resetArray();
  }

  componentDidMount(){
  //  this.createMap();
    console.log("componentDidMount()");
    console.log(this.state.options);
  }

  componentDidUpdate(){
    console.log("did update");
    console.log(this.state.ingredientsArray);
  }

  loadIngredientsArray(){
    console.log("ingredients array loaded");
    console.log(this.state.ingredientsArray);
    this.setState({ingredientsArray: this.props.initialArray});
  }

  async loadCodeNameArray(){
   // var startingIndex = 0;
    var rawData = [];
    //rawData = await ingredientActions.getAllIngredientNamesCodesAsync(sessionId);
    console.log("loadCodeNameArray was called");
    console.log(rawData.data);
    var optionsArray = rawData.data.map(obj=>{
    var temp = new Object();
    temp.ingredientName = obj.ingredientName;
    temp.label = obj.ingredientName;
    return temp;
    })
    var ans = optionsArray;
    for(var i=0; i<this.props.initialArray.length; i++){
      console.log("initialArray");
      console.log(this.props.initialArray);

      ans = ans.filter(option=>option.ingredientName!=this.props.initialArray[i].ingredientName);

    //  var index = optionsArray.map(item=>{item.ingredientName; console.log(item.ingredientName);}).indexOf(this.props.initialArray[i].ingredientName);
      console.log(ans);
    //  optionsArray.splice(index, 1);
    }
    this.setState({options: ans});
  }

  resetArray(name, action){
    var ans = [];
     if(action=="delete"){
       var obj = new Object();
       obj.ingredientName = name;
       obj.label = name;
       this.state.options.push(obj);
       console.log("what's up");
       console.log(this.state.options);
       this.setState({options:this.state.options});
     } else{
       ans = this.state.options.filter(option=>option.ingredientName!=name);
       this.setState({options:ans});
     }
  }

  // resetArray(){
  //   this.state.ingredientsArray.forEach((ingredient)=>{
  //     var index = this.state.options.map(item=>item.ingredientName).indexOf(ingredient.ingredientName);
  //     this.state.options.splice(index, 1);
  //   });
  //
  //   this.setState({options:this.state.options});
  //   //
  //   // var index = this.state.options.map(item=>item.ingredientName).indexOf(name);
  //   // this.state.options.splice(index, 1);
  //   // this.setState({options:this.state.options});
  // }

  // async createMap(){
  //   var list = this.state.options;
  //   var map = new Map();
  //   list.forEach(function(ingredient){
  //     map.set(ingredient.codeUnique, ingredient.name);
  //   });
  //   this.setState({idToNameMap:map});
  // }

  addIngredient(){

    var newIngredient = new Object();
    console.log("addIngredient() was called");
    console.log(this.state.selectName);
    var tempId = this.state.selectName.ingredientName;
    var priceFloat = parseFloat(this.state.inputPrice);
    newIngredient = {ingredientName: tempId, price: priceFloat};
    console.log(newIngredient);
    // var updateIngredient = new Array(this.state.ingredientsArray.slice(0));
    // updateIngredient.push(newIngredient);
    // console.log("I was called");
    // console.log( updateIngredient);
    this.state.ingredientsArray.push(newIngredient);
    this.setState({ingredientsArray:this.state.ingredientsArray});
    this.resetArray(tempId, "add");
    this.setState({inputPrice : 0});
    this.setState({selectName: ""})
    console.log(this.state.ingredientsArray);
    this.props.handleChange(this.state.ingredientsArray);
  }

  deleteIngredient(index, name){
    if (index !== -1) {
      console.log("delete");
      // var updateIngredient = this.state.ingredientsArray.slice();
      // updateIngredient.splice(index, 1);
      // console.log("deletedArray");
      // console.log(updateIngredient);
      // this.setState({ingredientsArray: updateIngredient});
      this.state.ingredientsArray.splice(index, 1);
      this.setState({ingredientsArray:this.state.ingredientsArray});
      this.resetArray(name, "delete");
      this.props.handleChange(this.state.ingredientsArray);
    }

  }

  updateId (ingredient, index) {
    console.log("updateId is fired");
    if(index!=-1){
      // var updateIngredient = this.state.ingredientsArray.slice();
      // updateIngredient[index].ingredient = ingredient.id;
      // this.setState({ingredientsArray: updateIngredient});
      this.state.ingredientsArray[index].ingredientName = ingredient.ingredientName;
      this.setState({ingredientsArray: this.state.ingredientsArray});
      this.props.handleChange(this.state.ingredientsArray);
    }
  }

  updatePrice (newPrice, index){
    console.log("this is the price");
    var price = parseFloat(newPrice.target.value);
    console.log(typeof (price));

    var isEmpty = (!price || (price.length==0));

    console.log(index);
    if(index>=0 && !isEmpty){
      // var updateIngredient = this.state.ingredientsArray.slice();
      // updateIngredient[index].price = newPrice.target.value;
      // this.setState({ingredientsArray: updateIngredient});
      this.state.ingredientsArray[index].price = price;
      this.setState({ingredientsArray: this.state.ingredientsArray});
      this.props.handleChange(this.state.ingredientsArray);
    }
  }

  updatePriceHere(newPrice){
    this.setState({inputPrice: newPrice.target.value});
  }

  updateName(value){
    console.log("updateName");
    console.log(value);
    this.setState({selectName: value});
  }

  render() {
    return (
    	<div>
      <Grid container spacing={16}>
        <Grid item sm={7}>
         <Select
          placeholder="Select New Ingredient"
          name="Ingredient Name"
          options={this.state.options}
          valueKey="ingredientName"
          value={this.state.selectName} //value displayed
          onChange={this.updateName.bind(this)}
          />
        </Grid>
        <Grid item sm={3}>
          <TextField value={this.state.inputPrice} onChange={(value)=>{this.updatePriceHere(value);}}/>
        </Grid>
        <Grid item sm={1}>
          <IconButton aria-label="Add" onClick={()=>{this.addIngredient();}}>
            <AddCircleIcon />
          </IconButton>
        </Grid>
      </Grid>
      <IngredientItem idToNameMap = {this.state.idToNameMap} ingredientsArray={this.state.ingredientsArray} deleteIngredient={this.deleteIngredient} updateId={this.updateId} updatePrice={this.updatePrice} options={this.state.options} />
      </div>
    );
  }
}

export default SelectIngredients
