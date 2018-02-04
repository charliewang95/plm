import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import AddCircleIcon from 'material-ui-icons/AddCircle';
import VendorItem from './VendorItem';

const VENDORS = require('./dummyVendors');

class SelectVendors extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectName: "",
      inputPrice: 0,
      options: [
                 {
                  name: "Target",
                  id: "ABCDe",
                 },
                 {  name: "Walmart",
                  id: "ABCDf",
                 },
                 {
                    name: "Duke",
                    id: "QWERe",
                 }
                ],
      vendorsArray: [{
                  id: "ABCDe",
                  price: 3
                 }],
      idToNameMap: {}, //id = key, name=value
    };
    this.updateId = this.updateId.bind(this);
    this.deleteVendor = this.deleteVendor.bind(this);
    this.addVendor = this.addVendor.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
  }

  componentWillMount(){
    this.createMap();
  }

  componentDidUpdate(){
    console.log("did update");
    console.log(this.state.vendorsArray);
  }

  createMap(){
    var map = new Map();
    for(var i; i<this.state.options.length; i++){
      var vendor = this.state.options[i];
      map.set(vendor.id, vendor.name);
    }
    this.setState({idToNameMap:map});
  }

  addVendor(){
    var newVendor = new Object();
    console.log(this.state.selectName.name);
    var tempId = this.state.selectName.id;
    newVendor = {id: tempId, price: this.state.inputPrice};
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
  }

  deleteVendor(index){
    if (index !== -1) {
      console.log("delete");
      console.log(this.state.vendorsArray);
      var updateVendor = this.state.vendorsArray.slice();
      updateVendor.splice(index,1);
      this.setState({vendorsArray: updateVendor});
    }
  }

  updateId (vendor, index) {
    if(index>0){
      var updateVendor = this.state.vendorsArray.slice();
      updateVendor[index].id = vendor.id;
      this.setState({vendorsArray: updateVendor});
    }else{
      console.log(vendor);
      console.log(vendor.name);
      this.setState({selectName: vendor.name});
      console.log(this.state.selectName);
    }
  }

  updatePrice (newPrice, index){
    console.log(newPrice.target.value);
    if(index>0){
      var updateVendor = this.state.vendorsArray.slice();
      updateVendor[index].price = newPrice.target.value;
      this.setState({vendorsArray:updateVendor});
    }else{
      this.setState({
        inputPrice: newPrice.target.value,
      });
    }
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
          name="Vendor Name"
          options={this.state.options}
          valueKey="id"
          labelKey="name"
          value={this.state.selectName} //value displayed
          onChange={this.updateName.bind(this)}
          />
        </Grid>
        <Grid item sm={3}>
          <TextField value={this.state.inputPrice} onChange={(value)=>{this.updatePrice(value, -1);}}/>
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