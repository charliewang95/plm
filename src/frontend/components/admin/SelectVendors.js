import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import VendorItem from './VendorItem';
import * as vendorActions from '../../interface/vendorInterface.js';
import * as testConfig from '../../../resources/testConfig.js';
import Tooltip from 'material-ui/Tooltip';
const VENDORS = require('./dummyVendors');


// TODO: get session Id from the user
//const sessionId = testConfig.sessionId;
const sessionId = '5a63be959144b37a6136491e';
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


class SelectVendors extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectName: "",
      inputPrice: 0,
      options: [],
      vendorsArray: this.props.initialArray,
      idToNameMap: {}, //id = key, name=value
    };
    this.updateId = this.updateId.bind(this);
    this.deleteVendor = this.deleteVendor.bind(this);
    this.addVendor = this.addVendor.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.loadVendorsArray = this.loadVendorsArray.bind(this);
    this.loadCodeNameArray = this.loadCodeNameArray.bind(this);
//    this.createMap = this.createMap.bind(this);
    this.resetArray = this.resetArray.bind(this);
  }

  componentWillMount(){
    this.loadCodeNameArray();
    this.loadVendorsArray();
  //  this.resetArray();
  }

  componentDidMount(){
  //  this.createMap();
    console.log("componentDidMount()");
    console.log(this.state.options);
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

  async loadCodeNameArray(){
   // var startingIndex = 0;
    var rawData = [];
    rawData = await vendorActions.getAllVendorNamesCodesAsync(sessionId);
    console.log("loadCodeNameArray was called");
    console.log(rawData.data);
    var optionsArray = rawData.data.map(obj=>{
    var temp = new Object();
    temp.vendorName = obj.vendorName;
    temp.label = obj.vendorName;
    return temp;
    })
    var ans = optionsArray;
    for(var i=0; i<this.props.initialArray.length; i++){
      console.log("initialArray");
      console.log(this.props.initialArray);

      ans = ans.filter(option=>option.vendorName!=this.props.initialArray[i].vendorName);

    //  var index = optionsArray.map(item=>{item.vendorName; console.log(item.vendorName);}).indexOf(this.props.initialArray[i].vendorName);
      console.log(ans);
    //  optionsArray.splice(index, 1);
    }
    this.setState({options: ans});
  }

  resetArray(name, action){
    var ans = [];
     if(action=="delete"){
       var obj = new Object();
       obj.vendorName = name;
       obj.label = name;
       this.state.options.push(obj);
       console.log("what's up");
       console.log(this.state.options);
       this.setState({options:this.state.options});
     } else{
       ans = this.state.options.filter(option=>option.vendorName!=name);
       this.setState({options:ans});
     }
  }

  // resetArray(){
  //   this.state.vendorsArray.forEach((vendor)=>{
  //     var index = this.state.options.map(item=>item.vendorName).indexOf(vendor.vendorName);
  //     this.state.options.splice(index, 1);
  //   });
  //
  //   this.setState({options:this.state.options});
  //   //
  //   // var index = this.state.options.map(item=>item.vendorName).indexOf(name);
  //   // this.state.options.splice(index, 1);
  //   // this.setState({options:this.state.options});
  // }

  // async createMap(){
  //   var list = this.state.options;
  //   var map = new Map();
  //   list.forEach(function(vendor){
  //     map.set(vendor.codeUnique, vendor.name);
  //   });
  //   this.setState({idToNameMap:map});
  // }

  addVendor(){

    var newVendor = new Object();
    console.log("addVendor() was called");
    console.log(this.state.selectName);
    var tempId = this.state.selectName.vendorName;
    var priceFloat = parseFloat(this.state.inputPrice);
    newVendor = {vendorName: tempId, price: priceFloat};
    console.log(newVendor);
    // var updateVendor = new Array(this.state.vendorsArray.slice(0));
    // updateVendor.push(newVendor);
    // console.log("I was called");
    // console.log( updateVendor);
    this.state.vendorsArray.push(newVendor);
    this.setState({vendorsArray:this.state.vendorsArray});
    this.resetArray(tempId, "add");
    this.setState({inputPrice : 0});
    this.setState({selectName: ""})
    console.log(this.state.vendorsArray);
    this.props.handleChange(this.state.vendorsArray);
  }

  deleteVendor(index, name){
    if (index !== -1) {
      console.log("delete");
      // var updateVendor = this.state.vendorsArray.slice();
      // updateVendor.splice(index, 1);
      // console.log("deletedArray");
      // console.log(updateVendor);
      // this.setState({vendorsArray: updateVendor});
      this.state.vendorsArray.splice(index, 1);
      this.setState({vendorsArray:this.state.vendorsArray});
      this.resetArray(name, "delete");
      this.props.handleChange(this.state.vendorsArray);
    }

  }

  updateId (vendor, index) {
    console.log("updateId is fired");
    if(index!=-1){
      // var updateVendor = this.state.vendorsArray.slice();
      // updateVendor[index].vendor = vendor.id;
      // this.setState({vendorsArray: updateVendor});
      this.state.vendorsArray[index].vendorName = vendor.vendorName;
      this.setState({vendorsArray: this.state.vendorsArray});
      this.props.handleChange(this.state.vendorsArray);
    }
  }

  updatePrice (newPrice, index){
    console.log("this is the price");
    var price = parseFloat(newPrice.target.value);
    console.log(typeof (price));

    var isEmpty = (!price || (price.length==0));

    console.log(index);
    if(index>=0 && !isEmpty){
      // var updateVendor = this.state.vendorsArray.slice();
      // updateVendor[index].price = newPrice.target.value;
      // this.setState({vendorsArray: updateVendor});
      this.state.vendorsArray[index].price = price;
      this.setState({vendorsArray: this.state.vendorsArray});
      this.props.handleChange(this.state.vendorsArray);
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
          placeholder="Select New Vendor"
          name="Vendor Name"
          options={this.state.options}
          valueKey="vendorName"
          value={this.state.selectName} //value displayed
          onChange={this.updateName.bind(this)}
          />
        </Grid>
        <Grid item sm={3}>
          <TextField value={this.state.inputPrice} onChange={(value)=>{this.updatePriceHere(value);}}/>
        </Grid>
        <Grid item sm={1}>
          <IconButton aria-label="Add" onClick={()=>{this.addVendor();}}>
            {this.state.selectName && (this.state.inputPrice>0) && 
               <Tooltip id="tooltip-top" title="Press to add vendor" placement="top-start">
                  <AddCircleIcon />
               </Tooltip>
            }
          </IconButton>
        </Grid>
      </Grid>
      <VendorItem idToNameMap = {this.state.idToNameMap} vendorsArray={this.state.vendorsArray} deleteVendor={this.deleteVendor} updateId={this.updateId} updatePrice={this.updatePrice} options={this.state.options} />
      </div>
    );
  }
}

export default SelectVendors
