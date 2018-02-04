import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import VendorItem from './VendorItem';
import * as testConfig from '../../../resources/testConfig.js'
import * as vendorActions from '../../interface/vendorInterface.js';
const VENDORS = require('./dummyVendors');
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
const sessionId = "5a6a5977f5ce6b254fe2a91f";

class SelectVendors extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectName: "",
      inputPrice: 0,
      options: [
       {
        name: "Target",
        id: "5a76b607c37e254b74f45b42",
       },
       {  
        name: "Vendor P",
        id: "5a76b571c37e254b74f45b3e",
       },
       {
        name: "Vendor R",
        id: "5a76b5bfc37e254b74f45b40",
       }
      ],
      vendorsArray: this.props.initialArray,
      idToNameMap: {}, //id = key, name=value
    };
    this.updateId = this.updateId.bind(this);
    this.deleteVendor = this.deleteVendor.bind(this);
    this.addVendor = this.addVendor.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.loadVendorsArray = this.loadVendorsArray.bind(this);
  }

  componentWillMount(){
    this.createMap();
    this.loadVendorsArray();
  }

  componentDidMount(){
  //  this.loadAllVendors();
  }

  componentDidUpdate(){
    console.log("did update");
    console.log(this.state.vendorsArray);
  }

  loadVendorsArray(){
    console.log("vendors array loaded");
    console.log(this.state.vendorsArray);
    this.setState({vendorsArray: this.props.initialArray});
  }

  async loadAllVendors(){
    var startingIndex = 0;
    var rawData = [];
    if(READ_FROM_DATABASE){
      //TODO: Initialize data
      rawData = await vendorActions.getAllVendorsAsync(sessionId);
      //commented out because collectively done after rawData is determined
      /*
      var processedData = [...rawData.map((row, index)=> ({
          id: startingIndex + index,...row,
        })),
      ];*/
    } else {
      rawData = VENDORS;
    }
      this.setState({options: rawData});
  }


  createMap(){
    // var map = new Map();
    // for(var i; i<this.state.options.length; i++){
    //   var vendor = this.state.options[i];
    //   map.set(vendor.id, vendor.name);
    // }
    // this.setState({idToNameMap:map});
    var map = new Map();
    map.set("5a76b571c37e254b74f45b3e", "Vendor P");
    map.set("5a76b5bfc37e254b74f45b40", "Vendor R")
    map.set("5a76b607c37e254b74f45b42", "Target");
    this.setState({idToNameMap:map});
  }

  addVendor(){
    var newVendor = new Object();
    console.log("hihi");
    console.log(this.state.selectName);
    var tempId = this.state.selectName.id;
    newVendor = {vendor: tempId, price: this.state.inputPrice};
    console.log(newVendor);
    // var updateVendor = new Array(this.state.vendorsArray.slice(0));
    // updateVendor.push(newVendor);
    // console.log("I was called");
    // console.log( updateVendor);
    this.state.vendorsArray.push(newVendor);
    this.setState({vendorsArray:this.state.vendorsArray});
    this.setState({inputPrice : 0});
    this.setState({selectName: ""})
    console.log(this.state.vendorsArray);
    this.props.handleChange(this.state.vendorsArray);
  }

  deleteVendor(index){
    if (index !== -1) {
      console.log("delete");
      console.log(this.state.vendorsArray);
      var updateVendor = this.state.vendorsArray.slice();
      updateVendor.splice(index,1);
      this.setState({vendorsArray: updateVendor});
    }
    this.props.handleChange(this.state.vendorsArray);
  }

  updateId (vendor, index) {
    console.log("updateId is fired");
    if(index!=-1){
      var updateVendor = this.state.vendorsArray.slice();
      updateVendor[index].vendor = vendor.id;
      this.setState({vendorsArray: updateVendor});
    }
  }

  updatePrice (newPrice, index){
    console.log(newPrice.target.value);
    if(index>0){
      var updateVendor = this.state.vendorsArray.slice();
      updateVendor[index].price = newPrice.target.value;
      this.setState({vendorsArray:updateVendor});
    }
  }

  updatePriceHere(newPrice){
    this.setState({inputPrice: newPrice.target.value});
  }

  updateName(value){
    this.setState({selectName: value});
  }

  render() {
    return (
    	<div>
      <Grid container spacing={16}>
        <Grid item sm={7}>
         <Select
          placeholder="Select New Vendor"
          name="Vendor Name"
          options={this.state.options}
          valueKey="id"
          labelKey="name"
          value={this.state.selectName} //value displayed
          onChange={this.updateName.bind(this)}
          />
        </Grid>
        <Grid item sm={3}>
          <TextField value={this.state.inputPrice} onChange={(value)=>{this.updatePriceHere(value);}}/>
        </Grid>
        <Grid item sm={1}>
          <IconButton aria-label="Add" onClick={()=>{this.addVendor();}}>
            <AddCircleIcon />
          </IconButton>
        </Grid>
      </Grid>
      <VendorItem idToNameMap = {this.state.idToNameMap} vendorsArray={this.state.vendorsArray} deleteVendor={this.deleteVendor} updateId={this.updateId} updatePrice={this.updatePrice} options={this.state.options} />
      </div>
    );
  }
}

export default SelectVendors