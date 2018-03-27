import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Styles from  'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';
import * as testConfig from '../../../resources/testConfig.js'
import * as ingredientActions from '../../interface/ingredientInterface';
import * as orderActions from '../../interface/orderInterface';
import * as vendorActions from '../../interface/vendorInterface';
import { Redirect } from 'react-router';
import Divider from 'material-ui/Divider';

import dummyData from './dummyData.js';
import testVendorData from '../vendors/dummyData.js';
import SimpleTable from './packageTable.js';
import Typography from 'material-ui/Typography';
import { FormControl, FormHelperText } from 'material-ui/Form';
import SnackBarDisplay from '../snackBar/snackBarDisplay';
//TODO: get session Id
//const userId = "5a765f3d9de95bea24f905d9";
// const sessionId = testConfig.sessionId;
var sessionId = '';
var userId = '';
var isAdmin;
const READ_FROM_DATABASE = true;


const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    saveButton: {
      marginLeft: 5
    },
    calculateButton:{
      marginLeft: 100
    }
  };


class Orders extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      ingredientName:'',
  		vendorName:'',
      vendorId:'',
      price: 0,
  		value:undefined,
      packagName:'',
      packageNum:'',
      ingredientId:'',
      rows:[],
      fireRedirect: false,
      ingredient_options:[],
      vendor_options:[],
      total: 0,
      numUnitPerPackage: 0,
      totalQuantity: 0,
      nativeUnit:'',
      totalFloorSpace: '',
      helpText: '',
      snackBarOpen:false,
      snackBarMessage:'',
      }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleVendorChange = this.handleVendorChange.bind(this);
    this.calculate = this.calculate.bind(this);
    this.isValid = this.isValid.bind(this);
    this.packageWeight = this.packageWeight.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
  }

  // load all the ingredients initially
  componentDidMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    userId =  JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    this.loadAllIngredients();
  }

    componentWillMount(){
        sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
        userId =  JSON.parse(sessionStorage.getItem('user'))._id;
        isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    }
  async loadAllIngredients(){
    console.log(" LOAD ALL INGREDIENTS");
    var rawData = [];
    if(READ_FROM_DATABASE){
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await ingredientActions.getAllIngredientsOnlyAsync(sessionId);
      rawData = rawData.data;
      console.log("data from DB " + JSON.stringify(rawData));
    }else{
      rawData = dummyData;
    }
    var parsedIngredientOptions = [...rawData.map((row, index)=> ({
        value: row._id,label: row.name, numUnitPerPackage:
        row.numUnitPerPackage, nativeUnit: row.nativeUnit,
        packageName: row.packageName,
      })),
    ];
    console.log("parsedIngredientOptions" + JSON.stringify(parsedIngredientOptions));
    this.setState({ingredient_options:parsedIngredientOptions});
    console.log("Ingredient Options " + JSON.stringify(parsedIngredientOptions));
    }


 async handleIngredientChange(option) {
    var packageNameHelpText = option.numUnitPerPackage + ' ' + option.nativeUnit + ' / ' +
    this.packageWeight(option.packageName) + ' sqft';
    this.setState({helpText:packageNameHelpText});
    console.log(" Ingredient Selected " + option.label);
    this.setState({ingredientName: option.label});
    this.setState({packageName:option.packageName});
    this.setState({ingredientId:option.value});
    this.setState({numUnitPerPackage: option.numUnitPerPackage});
    this.setState({nativeUnit: option.nativeUnit});
    var ingredientDetails;
    //TODO: get vendors list for the selected ingredient
    try{
       ingredientDetails = await ingredientActions.getIngredientAsync(option.value,sessionId);
    }catch(e){
      console.log('An error passed to the front end!')
      alert(e);
    }

    console.log("Vendors " + JSON.stringify(ingredientDetails.vendors));
    ingredientDetails.vendors.sort(function(a, b) {return a.price - b.price });

    var parsedVendorOptions = [...ingredientDetails.vendors.map((row,index)=> ({
        value: (row.vendorId), label: (row.vendorName + " / Price: $ " + row.price),
        price: row.price, numUnitPerPackage: row.numUnitPerPackage, nativeUnit: row.nativeUnit,
        vendorName: row.vendorName,
      })),
    ];

    console.log("Vendor options " + JSON.stringify(parsedVendorOptions));
    this.setState({vendor_options:parsedVendorOptions});
    this.setState({vendorId:parsedVendorOptions[0].value});
    this.setState({price: parsedVendorOptions[0].price});
    this.setState({vendorName: parsedVendorOptions[0].vendorName});
  }

// event handler when a vendor is selected from the drop down
  handleVendorChange(option){
    this.setState({vendorId: option.value});
    this.setState({price: option.price});
    this.setState({vendorName: option.vendorName});
  }

  // event handler when packageNum is changed
  handleQuantityChange(event){
  const re =/^[1-9]\d*$/;
      if (event.target.value == '' || re.test(event.target.value)) {
         this.setState({packageNum: event.target.value})
      }else{
        alert(" No of Packages must be a number.");
      }
  }

 componentDidUpdate(){
  this.calculate();
 }

 async onFormSubmit(e) {
   var temp = this;
    console.log("SUBMIT");
    console.log("Vendor Name " + this.state.vendorName);
    console.log("package Name " + this.state.packageName);
    console.log("ingredientId " + this.state.ingredientId);
    console.log("vendorId " + this.state.vendorId);
    console.log("packageNum " + this.state.packageNum);
    e.preventDefault();
    //TODO: Send data to back end
   try{
     if(temp.isValid()){

       await orderActions.addOrder(userId,temp.state.ingredientId,temp.state.ingredientName,
       temp.state.vendorName,parseInt(temp.state.packageNum,10),temp.state.price,[], sessionId,function(res){
           if (res.status == 400) {
               alert(res.data);
           }else if (res.status == 500) {
               alert('ingredient already in cart');
           }
           else{
             // alert("ORDERED");
             temp.setState({snackBarMessage : "Ingredient ordered successfully!"});
             temp.setState({snackBarOpen:true});
             temp.setState({ fireRedirect: true });
             }
           });
       };
     }
   catch (e){
     console.log('An error passed to the front end!')
     //TODO: error handling in the front end
     alert(e);
   }
  }

  packageWeight(input){
    if(input=='drum'){
      return '3';
    }
    else if(input=='supersack'){
      return '16';
    }else if(input=='sack'){
      return '0.5';
    }else if(input=='pail'){
      return '1';
    }else{
      return 'N/A';
    }
  }

  calculate(){
    var temp = this;
    //var packageWeight = this.packageWeight();
    var totalPrice = temp.state.packageNum * temp.state.price;
    var totalNativeUnits = temp.state.packageNum * temp.state.numUnitPerPackage;
  //  var packageWeight = parseFloat(packageWeight());
    var totalSqft;

    if(temp.packageWeight(temp.state.packageName)=='N/A'){
      totalSqft = 'N/A';
    }else{
      var computeFloor = temp.state.packageNum * temp.packageWeight(temp.state.packageName);
      totalSqft = computeFloor.toString();
    }
    temp.setState({total: totalPrice});
    temp.setState({totalQuantity: totalNativeUnits});
    temp.setState({totalFloorSpace: totalSqft});
   // this.setState({totalFloorSpace: totalSqft});
  }

  handleSnackBarClose(){
    this.setState({snackBarOpen:false});
    this.setState({snackBarMessage: ''});
  }

  clearFields(){
    console.log(" Comes HERE ");
    this.setState({vendorName:""});
    this.setState({vendorId:""});
    this.setState({packageName:''});
    this.setState({ingredientId:''});
    this.setState({vendor_options: []});
    this.setState({packageNum: ''});
  }

  // Check for validation of the data fields before submitting an order
  isValid(){
    if(!this.state.ingredientName){
      alert(" Please select an ingredient");
      return false;
  }else{
      return true;
    }
  }

  render (){
    const { vendorName, vendorId, packagName, packageNum,ingredientId,rows,
      fireRedirect ,ingredient_options,vendor_options} = this.state;
    return (
        <div>
         <p><font size="6">Place an Order</font></p>
            <form style={{width:400}} onSubmit={this.onFormSubmit} >
              <div style = {styles.buttons}>
                 <p><font size="3">Ingredient Name:</font></p>
                <Select
                  required
        					multi={false}
        					options={ingredient_options}
        					onChange={(option) => this.handleIngredientChange(option)}
                  value = {ingredientId}
                  placeholder="Type to select an ingredient..."
                />
              </div>
            <div style = {styles.buttons}>
            <FormControl>
              <label> Package: </label>
              <TextField
                  fullWidth={true}
                  disabled={true}
                  id="packageName"
                  value={this.state.packageName}
                  onChange = {(event) => this.setState({ packageName: event.target.value})}
                  margin="dense"
              />
              <FormHelperText>{this.state.helpText}</FormHelperText>
            </FormControl>
            </div>
            <br></br>
            <label> Quantity of Package: </label>
              <TextField
                  required
                  fullWidth={true}
                  id="packageNum"
                  value={this.state.packageNum}
                  onChange = {(event) => this.handleQuantityChange(event)}
                  margin="dense"
              />
              {/* <div style = {styles.buttons}>
                <p><font size="3">Vendor</font></p>
                <Select
                  required
                  multi={false}
                  options={vendor_options}
                  onChange={(option) => this.handleVendorChange(option)}
                  value = {vendorId}
                  placeholder="Type to select a Vendor..."
                />
              </div> */}
              <br></br>
              <br></br>
              <Divider></Divider>
              <p><font size="6">Total Quantity: {this.state.totalQuantity} {this.state.nativeUnit}</font></p>
              <p><font size="6">Total Floor Space: {this.state.totalFloorSpace} sqft</font></p>
              <p><font size="6">Current Total: $ {this.state.total.toFixed(2)}</font></p>
              <br></br>
              <div style={styles.buttons}>
                  <RaisedButton raised
                    color="primary"
                    // component = {Link} to = "/vendors" //commented out because it overrides onSubmit
                    type="Submit"
                    disabled = {this.state.packageNum==0 || this.state.ingredientName==''}
                    primary="true"> ORDER </RaisedButton>
                    <RaisedButton raised color = "secondary"
                    style={styles.saveButton}
                    component = {Link} to = "/admin-ingredients"
                    >
                    BACK</RaisedButton>
             </div>
           </form>
           {this.state.snackBarOpen && <SnackBarDisplay
                 open = {this.state.snackBarOpen}
                 message = {this.state.snackBarMessage}
                 handleSnackBarClose = {this.handleSnackBarClose}
               /> }

           {fireRedirect && (
             <Redirect to={'/cart'}/>
           )}
         </div>
         )
        }
      };

export default Orders;
