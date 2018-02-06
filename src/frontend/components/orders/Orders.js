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


//TODO: get session Id
const userId = "5a63be959144b37a6136491e";
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


class Orders extends React.PureComponent{
  constructor(props) {
    super(props);
    this.state = {
  		vendorName:'',
      vendorId:'',
  		value:undefined,
      packagName:'',
      quantity:'',
      ingredientId:'',
      rows:[],
      fireRedirect: false,
      ingredient_options:[],
      vendor_options:[],
      }

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.handleVendorChange = this.handleVendorChange.bind(this);
  }

  // load all the ingredients initially
  componentDidMount(){
    this.loadAllIngredients();
  }

   async loadAllIngredients(){
     var rawData = [];
    if(READ_FROM_DATABASE){
      rawData = await ingredientActions.getAllIngredientsAsync(sessionId);
    }else{
    rawData = dummyData;

    // Gets the ingredient Options from the data
    var parsedIngredientOptions = [...rawData.map((row, index)=> ({
        value: row._id,label: row.name,packageName: row.packageName,
      })),
    ];

    this.setState({ingredient_options:parsedIngredientOptions});

    console.log("Ingredient Options " + JSON.stringify(parsedIngredientOptions));
    // console.log(" Ingredient Options " + JSON.stringify(this.state.ingredient_options));
    // Set the options for the ingredients
    }
  }

  async handleIngredientChange(option) {
    console.log(" Ingredient Selected ");

    console.log("Package Name " + option.packageName);

    this.setState({packageName:option.packageName});
    this.setState({ingredientId:option.value});

    //TODO: get vendors list for the selected ingredient
    try{
      var ingredientDetails = ingredientActions.getIngredientAsync(option.value,sessionId);
      // var ingredientDetails = dummyData[1];
      var parsedVendorOptions = [...ingredientDetails.vendors.map((row,index)=> ({
          value: row.vendorId,label: (row.vendorName + " / Price: $ " + row.price),
          price: row.price,
        })),
      ];
    }catch(e){
      console.log('An error passed to the front end!')
      //TODO: error handling in the front end
      alert(e);
    }
    this.setState({vendor_options:parsedVendorOptions});
  }

// event handler when a vendor is selected from the drop down
  handleVendorChange(option){
    console.log("Vendor Changed");
    console.log(" value " + option.value);
    console.log(" label " + option.label);
    console.log(" price " + option.price);

    this.setState({vendorId: option.value});
    this.setState({price: option.price});

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
    try{
      const response = await orderActions.addOrder(userId,this.state.ingredientId,
      this.state.vendorId,this.state.quantity,this.state.price,sessionId);
      this.setState({ fireRedirect: true });
    }
    catch (e){
      console.log('An error passed to the front end!')
      //TODO: error handling in the front end
      alert(e);
    }
  }

  render (){
    const { vendorName, vendorId, packagName, quantity,ingredientId,rows,
      fireRedirect ,ingredient_options,vendor_options} = this.state;
    return (
      // <PageBase title = 'Add Ingredients' navigation = '/Application Form'>
        <div>
          <label> Place an Order </label>
            <form onSubmit={this.onFormSubmit} >
              <div style = {styles.buttons}>
                <label> Ingredient Name: </label>
                <Select
                  required
        					multi={false}
        					options={ingredient_options}
        					onChange={(option) => this.handleIngredientChange(option)}
                  value = {ingredientId}
                />
              </div>
            <div style = {styles.buttons}>
              <label> Package: </label>
              <TextField
                  fullWidth={true}
                  disabled={true}
                  id="packageName"
                  // label="Package"
                  value={this.state.packageName}
                  onChange = {(event) => this.setState({ packageName: event.target.value})}
                  margin="dense"
                  verticalSpacing= "dense"
              />
            </div>
              <TextField
                  required
                  fullWidth={true}
                  id="quantity"
                  label="Quantity of Package:"
                  value={this.state.quantity}
                  onChange = {(event) => this.setState({ quantity: event.target.value})}
                  margin="normal"
              />
              <div style = {styles.buttons}>
                <label> Vendor: </label>
                <Select
                  required
                  multi={false}
                  options={vendor_options}
                  onChange={(option) => this.handleVendorChange(option)}
                  value = {vendorId}
                />
              </div>
              <div style={styles.buttons}>
                  <RaisedButton raised color = "secondary"
                    component = {Link} to = "/dashboard">CANCEL</RaisedButton>
                  <RaisedButton raised
                            color="primary"
                            // component = {Link} to = "/vendors" //commented out because it overrides onSubmit
                            style={styles.saveButton}
                            type="Submit"
                            primary="true"> SAVE </RaisedButton>
             </div>
           </form>
           {fireRedirect && (
             <Redirect to={'/dashboard'}/>
           )}
         </div>
         )
        }
      };

export default Orders;
