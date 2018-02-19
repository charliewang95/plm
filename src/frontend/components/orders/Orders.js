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

//TODO: get session Id
const userId = "5a765f3d9de95bea24f905d9";
// const sessionId = testConfig.sessionId;
var sessionId = '';
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


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
  		vendorName:'',
      vendorId:'',
      price: 0,
  		value:undefined,
      packagName:'',
      quantity:'',
      ingredientId:'',
      rows:[],
      fireRedirect: false,
      ingredient_options:[],
      vendor_options:[],
      total: 0,
      }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleVendorChange = this.handleVendorChange.bind(this);
    this.calculate = this.calculate.bind(this);
  }

  // load all the ingredients initially
  componentDidMount(){
    this.loadAllIngredients();
  }

   async loadAllIngredients(){
     console.log(" LOAD ALL INGREDIENTS");
     var rawData = [];
    if(READ_FROM_DATABASE){
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await ingredientActions.getAllIngredientsAsync(sessionId);
      console.log("data from DB " + JSON.stringify(rawData));
    }else{
    rawData = dummyData;
    }
    var parsedIngredientOptions = [...rawData.map((row, index)=> ({
        value: row._id,label: row.name,packageName: row.packageName,
      })),
    ];

    console.log("parsedIngredientOptions" + JSON.stringify(parsedIngredientOptions));
    this.setState({ingredient_options:parsedIngredientOptions});

    console.log("Ingredient Options " + JSON.stringify(parsedIngredientOptions));
    }


  async handleIngredientChange(option) {
    console.log(" Ingredient Selected " + option.label);

    this.setState({packageName:option.packageName});
    this.setState({ingredientId:option.value});
    var ingredientDetails;
    //TODO: get vendors list for the selected ingredient
    try{
       ingredientDetails = await ingredientActions.getIngredientAsync(option.value,sessionId);
    }catch(e){
      console.log('An error passed to the front end!')
      alert(e);
    }
    console.log("Vendors " + JSON.stringify(ingredientDetails.vendors));

                    var parsedVendorOptions = [...ingredientDetails.vendors.map((row,index)=> ({
                        value: (row.vendorId), label: (row.vendorName + " / Price: $ " + row.price),
                        price: row.price,
                      })),
                    ];
                    console.log("Vendor options " + JSON.stringify(parsedVendorOptions));
                    this.setState({vendor_options:parsedVendorOptions});
//    ingredientActions.getIngredientAsync(option.value,sessionId, function(res){
//        if (res.status == 400) {
//            alert(res.data);
//        } else {
//            ingredientDetails = res;
//             console.log("Vendors " + JSON.stringify(ingredientDetails.vendors));
//
//                var parsedVendorOptions = [...ingredientDetails.vendors.map((row,index)=> ({
//                    value: (row.vendorId), label: (row.vendorName + " / Price: $ " + row.price),
//                    price: row.price,
//                  })),
//                ];
//                console.log("Vendor options " + JSON.stringify(parsedVendorOptions));
//                this.setState({vendor_options:parsedVendorOptions});
//        }
//    })
  }

// event handler when a vendor is selected from the drop down
  handleVendorChange(option){
    this.setState({vendorId: option.value});
    this.setState({price: option.price});
  }

  // event handler when quantity is changed
  handleQuantityChange(event){
  const re = /^[0-9\b]+$/;
      if (event.target.value == '' || re.test(event.target.value)) {
         this.setState({quantity: event.target.value})
      }else{
        alert(" Quantity must be a number.");
      }
  }

 componentDidUpdate(){
  this.calculate();
 }

 async onFormSubmit(e) {
    console.log("SUBMIT");
    console.log("Vendor Name " + this.state.vendorName);
    console.log("package Name " + this.state.packageName);
    console.log("ingredientId " + this.state.ingredientId);
    console.log("vendorId " + this.state.vendorId);
    console.log("quantity " + this.state.quantity);
    e.preventDefault();
    //TODO: Send data to back end
//    try{
//
//      const response = await orderActions.addOrder(userId,this.state.ingredientId,
//      this.state.vendorId,parseInt(this.state.quantity,10),this.state.price,sessionId);
//      this.setState({ fireRedirect: true });
//    }
//    catch (e){
//      console.log('An error passed to the front end!')
//      //TODO: error handling in the front end
//      alert(e);
//    }
        await orderActions.addOrder(userId,this.state.ingredientId,
        this.state.vendorId,parseInt(this.state.quantity,10),this.state.price,sessionId,function(res){
            if (res.status == 400) {
                alert(res.data);
            }else{
              alert(" Ingredient ordered successfully! Please check the inventory to see the updated amount.")
            }
        });
    this.clearFields();
  }

  packageWeight(){
    if(this.state.packageName=='drum'){
      return 500;
    }
    else if(this.state.packageName=='supersack'){
      return 2000;
    }else if(this.state.packageName=='truckload'){
      return 5000;
    }else if(this.state.packageName=='railcar'){
      return 280000
    }else{
      return 50;
    }
  }

  calculate(){
    console.log("clicked!");
    //var packageWeight = this.packageWeight();
    var tempTotal = this.state.quantity * this.state.price;
    console.log(tempTotal);
    this.setState({total: tempTotal});
  }

  clearFields(){
    console.log(" Comes HERE ");
    this.setState({vendorName:""});
    this.setState({vendorId:""});
    this.setState({packageName:''});
    this.setState({ingredientId:''});
    this.setState({vendor_options: []});
    this.setState({quantity: ''});
  }

  render (){
    const { vendorName, vendorId, packagName, quantity,ingredientId,rows,
      fireRedirect ,ingredient_options,vendor_options} = this.state;
    return (
        <div>
         <p><font size="6">Place an Order</font></p>
            <form onSubmit={this.onFormSubmit} >
              <div style = {styles.buttons}>
                 <p><font size="3">Ingredient Name:</font></p>
                <Select
                  required
        					multi={false}
        					options={ingredient_options}
        					onChange={(option) => this.handleIngredientChange(option)}
                  value = {ingredientId}
                />
              </div>
            <div style = {styles.buttons}>
              <label> Package (Refer to the table below): </label>
              <TextField
                  fullWidth={true}
                  disabled={true}
                  id="packageName"
                  value={this.state.packageName}
                  onChange = {(event) => this.setState({ packageName: event.target.value})}
                  margin="dense"
              />
            </div>
            <br></br>
            <label> Quantity of Package: </label>
              <TextField
                  required
                  fullWidth={true}
                  id="quantity"
                  value={this.state.quantity}
                  onChange = {(event) => this.handleQuantityChange(event)}
                  margin="dense"
              />
              <div style = {styles.buttons}>
                <p><font size="3">Vendor</font></p>
                <Select
                  required
                  multi={false}
                  options={vendor_options}
                  onChange={(option) => this.handleVendorChange(option)}
                  value = {vendorId}
                />
              </div>
              <p><font size="6">Current Total: $ {this.state.total}</font></p>
              <Divider></Divider>
              <br></br>
              <SimpleTable />
              <div style={styles.buttons}>
                  <RaisedButton raised color = "secondary"
                    // component = {Link} to = "/orders"
                    onClick ={(event) => this.clearFields(event)}>
                    CANCEL</RaisedButton>
                  <RaisedButton raised
                            color="primary"
                            // component = {Link} to = "/vendors" //commented out because it overrides onSubmit
                            style={styles.saveButton}
                            type="Submit"
                            primary="true"> ORDER </RaisedButton>
             </div>
           </form>
           {fireRedirect && (
             <Redirect to={'/orders'}/>
           )}
         </div>
         )
        }
      };

export default Orders;
