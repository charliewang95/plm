import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormGroup, FormHelperText } from 'material-ui/Form';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import LotNumberArray from './StockLotNumberArray';


class LotNumberSelector extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // totalAssigned: (this.props.numUnit)?(this.props.numUnit):0, //total number assigned
      lotNumberArray:[],
      currentLotNumber: '',
      currentQuantity:0,
      nativeUnit:(this.props.nativeUnit)?(this.props.nativeUnit):'',
      initialArray:(this.props.initialArray)?(this.props.initialArray):[],
    };
    this.addLotNumberItem = this.addLotNumberItem.bind(this);
    this.deleteLotNumberItem = this.deleteLotNumberItem.bind(this);
    this.updateLotNumber = this.updateLotNumber.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.updateCurrentLotNumber = this.updateCurrentLotNumber.bind(this);
    this.updateCurrentQuantity = this.updateCurrentQuantity.bind(this);
    this.loadLotNumbersArray = this.loadLotNumbersArray.bind(this);
    this.checkLotNumberUnique = this.checkLotNumberUnique.bind(this);

  }


  componentWillMount(){
    this.loadLotNumbersArray();
  //  this.resetArray();
  console.log("total assigned");
  console.log(this.props.totalAssigned);
  }

  loadLotNumbersArray(){
    console.log("Lot number selector will mount");
    console.log(this.props.initialArray);
    // modify numUnit tag to package tag
    var array =[];
    // for(int i =0; i < this.props.initialArray.length;i++){
    //   var lotNumberObject = new Object();
    //   lotNumberObject.numUnit =
    // }
    this.setState({lotNumberArray:this.props.initialArray},function cb(){
      console.log("lot numbers initialized");
    })
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

  checkLotNumberUnique(lotNumber){
    for(var i = 0; i < this.state.lotNumberArray.length;i++){
      if(lotNumber.toLowerCase()==this.state.lotNumberArray[i].lotNumber.toLowerCase()){
        return false;
      }
    }
    return true;
  }

  addLotNumberItem(){
    console.log("add lot item");
    if(this.checkLotNumberUnique(this.state.currentLotNumber)){
      var newLotNumberItem = new Object();
      newLotNumberItem.numUnit = Number(this.state.currentQuantity);
      newLotNumberItem.lotNumber = this.state.currentLotNumber;
      this.state.lotNumberArray.push(newLotNumberItem);

      //update Total assigned
      // this.setState({totalAssigned:this.state.totalAssigned+this.state.currentQuantity});

      this.setState({lotNumberArray:this.state.lotNumberArray});
      this.setState({currentQuantity: ''});
      this.setState({currentLotNumber: ''});
      this.props.updateArray(this.state.lotNumberArray);
    }else{
      alert("Lot Numbers should be unique!");
    }
    console.log("array");
    console.log(this.state.lotNumberArray);
    console.log(this.props.totalAssigned);
    console.log(this.props.quantity);
  }

  deleteLotNumberItem(index){
    console.log("deleted lot number item");
    console.log(this.props.totalAssigned);
    console.log(this.state.lotNumberArray[index].numUnit);
    if (index !== -1) {
      var updatedQuantity = this.props.totalAssigned - this.state.lotNumberArray[index].numUnit;

      this.state.lotNumberArray.splice(index, 1);
      this.setState({lotNumberArray:this.state.lotNumberArray});
      this.setState({totalAssigned:updatedQuantity});
      this.props.updateArray(this.state.lotNumberArray);
    }
    console.log("Left");
    console.log(this.props.quantity);
    console.log(this.props.totalAssigned);
    // console.log(this.state.totalAssigned);
    console.log(this.state.currentQuantity);
    console.log(this.props.quantity-this.props.totalAssigned-this.state.currentQuantity);
  }

  updateLotNumber (event, index) {
    var lotNumber = event.target.value;
    if(index!=-1 ){
      if(!this.checkLotNumberUnique(lotNumber)){
        alert("Lot number must be unique!");
      }else{
      //Add check for data type
        this.state.lotNumberArray[index].lotNumber = lotNumber;
        this.setState({lotNumberArray: this.state.lotNumberArray});
        this.props.updateArray(this.state.lotNumberArray);
      }
    }
  }

  updateQuantity(event, index) {
    console.log("update Quantity in textbox");
    console.log(event.target.value);
    var quantity = event.target.value;
    if(index>=0){
      const re = /^\d*\.?\d*$/;
      if(!re.test(quantity)){
        alert("Quantity must be a positive integer");
      }else{
        this.state.lotNumberArray[index].numUnit = quantity;
        this.setState({lotNumberArray: this.state.lotNumberArray});
        this.props.updateArray(this.state.lotNumberArray);
      }
    }
    console.log(this.props.totalAssigned);
    console.log(this.props.quantity);
  }

  updateCurrentLotNumber (event){
    var lotNumber = event.target.value;
//    const re = /^[a-z0-9]+$/i;
//      if(lotNumber==''&& (re.test(lotNumber))) {
        this.setState({currentLotNumber: lotNumber});
//      }else{
//        alert("Lot Number must be alphanumeric.");
//      }
  }

  updateCurrentQuantity(event){
    console.log("Update current quantity");
    var quantity = event.target.value;
    const re = /^\d*\.?\d*$/;
    // if(this.props.quantity==0 || this.props.quantity==''){
    //   alert("Please enter a quantity first");
    // }
    if(!re.test(quantity)){
      alert("Quantity must be a positive integer");
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
            <InputLabel htmlFor="currentQuantity"> Quantity </InputLabel>
            <Input
              type="number"
              value={this.state.currentQuantity}
              onChange={(event)=>{this.updateCurrentQuantity(event);}}
              disabled={this.props.totalAssigned>this.props.quantity}
            />
         </FormControl>
         <FormControl style={{marginLeft: 10, width:100}}>
          <InputLabel htmlFor="lotNumber">Lot Number</InputLabel>
          <Input
            value={this.state.currentLotNumber}
            onChange={(event)=>{this.updateCurrentLotNumber(event);}}
            disabled={this.props.totalAssigned>this.props.quantity}
          />
          </FormControl>
        {this.state.currentQuantity && this.state.currentLotNumber &&
         <Button raised style={{marginLeft:10}} onClick={()=>{this.addLotNumberItem();}}>RECORD</Button>}
         {/* </FormControl> */}
         </div>
         }

      <br/>
       {(this.props.totalAssigned>this.props.quantity) ?
          <Typography color="error">Delete Extra Packages: {((this.props.totalAssigned)-(this.props.quantity))}</Typography> :

         ((Number(this.props.quantity)-Number(this.props.totalAssigned)-Number(this.state.currentQuantity))!=0) ?
            <Typography color="error">{"Quantity (" + this.state.nativeUnit + ") left to assign: " +
                                (this.props.quantity-this.props.totalAssigned-this.state.currentQuantity).toString()}</Typography> :
            (this.props.quantity==''||this.props.totalAssigned=='') ? <div></div> :
            <p><font color="green">All stock quantity has been assigned!</font></p>
          }
      {(this.state.lotNumberArray.length>0) &&  <p>{"Quantity (" + this.state.nativeUnit + ") Assigned"}</p> }

      {(this.state.lotNumberArray.length>0) &&  <LotNumberArray
                nativeUnit={this.state.nativeUnit}
                lotNumberArray={this.state.lotNumberArray}
                deleteLotNumberItem={this.deleteLotNumberItem}
                updateQuantity={this.updateQuantity}
                updateLotNumber={this.updateLotNumber}/>}
      </div>
    );
  }
}

export default LotNumberSelector
