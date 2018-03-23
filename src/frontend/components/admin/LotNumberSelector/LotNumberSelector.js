import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import LotNumberArray from './LotNumberArray';
import Tooltip from 'material-ui/Tooltip';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';


class LotNumberSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      //totalAssigned: this.props.totalAssigned, //total number assigned
      lotNumberArray: [],
      currentLotNumber: '',
      currentQuantity: '',
    };
    this.addLotNumberItem = this.addLotNumberItem.bind(this);
    this.deleteLotNumberItem = this.deleteLotNumberItem.bind(this);
    this.updateLotNumber = this.updateLotNumber.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.updateCurrentLotNumber = this.updateCurrentLotNumber.bind(this);
    this.updateCurrentQuantity = this.updateCurrentQuantity.bind(this);
  }
  
  componentDidUpdate(){
    console.log(this.state.currentQuantity);
    console.log(this.props.quantity);
    var num;
    if(!this.state.currentQuantity){
      num = 0;
    }else{
      num=this.state.currentQuantity;
    }
    if(parseInt(this.props.quantity)<num){
      this.setState({currentQuantity:''});
    }
  }
  addLotNumberItem(){
    var newLotNumberItem = new Object();
    newLotNumberItem.package = this.state.currentQuantity;
    newLotNumberItem.lotNumber = this.state.currentLotNumber;
    this.state.lotNumberArray.push(newLotNumberItem);
    this.setState({lotNumberArray:this.state.lotNumberArray});
    this.setState({currentQuantity: ''});
    this.setState({currentLotNumber: ''});
    console.log("array");
    console.log(this.state.lotNumberArray);
    this.props.updateArray(this.state.lotNumberArray);
  }

  deleteLotNumberItem(index){
    if (index !== -1) {
      var updatedQuantity = this.props.totalAssigned - this.state.lotNumberArray[index].package;

      this.state.lotNumberArray.splice(index, 1);
      this.setState({lotNumberArray:this.state.lotNumberArray});
      this.props.updateArray(this.state.lotNumberArray);
    }
  }

  updateLotNumber (event, index) {
    var lotNumber = event.target.value;
    if(index!=-1){
      this.state.lotNumberArray[index].lotNumber = lotNumber;
      this.setState({lotNumberArray: this.state.lotNumberArray});
      this.props.updateArray(this.state.lotNumberArray);
    }
  }

  updateQuantity(event, index) {
    var quantity = event.target.value;
    if(index>=0){
      this.state.lotNumberArray[index].package = quantity;
      this.setState({lotNumberArray: this.state.lotNumberArray});
      this.props.updateArray(this.state.lotNumberArray);
    }
  }

  updateCurrentLotNumber (event){
    var lotNumber = event.target.value;
    const re = /^[a-z0-9]+$/i;
      if(lotNumber==''|| (re.test(lotNumber))) {
        this.setState({currentLotNumber: lotNumber});
      }else{
        alert("Lot Number must be alphanumeric.");
      }
  }

  updateCurrentQuantity(event){
    var quantity = event.target.value;
    if(this.props.quantity==0 || this.props.quantity==''){
      alert("Please enter a quantity first");
    }
    else if(quantity>(this.props.quantity-this.props.totalAssigned) || (quantity==0 && quantity!='')){
      alert("Please enter a number less than or equal to " + (this.props.quantity-this.props.totalAssigned));
    }else{
      this.setState({currentQuantity:quantity});
    }
  }

  render() {
    return (
      <div>
          <p>Lot Number</p>
          {(this.props.quantity=='') && <p>Please fill in quantity</p>}
          {(!(this.props.totalAssigned>this.props.quantity)&&((this.props.quantity-this.props.totalAssigned)!=0))&&
          <div>
          <FormControl style={{width:130}}>
            <InputLabel htmlFor="currentQuantity">Package Quantity</InputLabel>
            <Input
              type="number"
              value={this.state.currentQuantity}
              onChange={(event)=>{this.updateCurrentQuantity(event);}}
              disabled={this.props.totalAssigned>this.props.quantity}
            />
         </FormControl>
         <FormControl style={{marginLeft: 10}}>
          <InputLabel htmlFor="lotNumber">Lot Number</InputLabel>
          <Input
            value={this.state.currentLotNumber}
            onChange={(event)=>{this.updateCurrentLotNumber(event);}}
            disabled={this.props.totalAssigned>this.props.quantity}
          />
         </FormControl>
        {this.state.currentQuantity && this.state.currentLotNumber && 
         <Button raised style={{marginLeft:10}} onClick={()=>{this.addLotNumberItem();}}>RECORD</Button>}
         </div>
         }
      <br/>
       {(this.props.totalAssigned>this.props.quantity) ?
          <Typography color="error">Delete Extra Packages: {this.props.totalAssigned-this.props.quantity}</Typography> :
         ((this.props.quantity-this.props.totalAssigned-this.state.currentQuantity)!=0) ?
            <Typography color="error">Packages left to assign: {this.props.quantity-this.props.totalAssigned-this.state.currentQuantity}</Typography> :
            (this.props.quantity==''||this.props.totalAssigned=='') ? <div></div> :
            <p><font color="green">All Packages have been assigned!</font></p>
          }
      {(this.state.lotNumberArray.length>0) && <LotNumberArray lotNumberArray={this.state.lotNumberArray} deleteLotNumberItem={this.deleteLotNumberItem} updateQuantity={this.updateQuantity} updateLotNumber={this.updateLotNumber}/>}
      </div>
    );
  }
}

export default LotNumberSelector
