
import * as React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

var userId;
var sessionId;
var isAdmin;
var isManager;

class EditQuantity extends React.Component{

  constructor(props) {
    super(props);
    var dummyObject = new Object();
    const detailRow = (props.location.state)?(props.location.state.row):dummyObject;
    this.state = {
      row: detailRow,
      quantity: detailRow.quantityToSell,
      unitPrice: detailRow.unitPrice,
      revenue:detailRow.quantityToSell * detailRow.unitPrice,
    }
    this.updateUnitPrice = this.updateUnitPrice.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.quantitySaveValid = this.quantitySaveValid.bind(this);
    this.updateEditQuantity = this.updateEditQuantity.bind(this);

    this.cancelEdit = ()=>{
      this.setState({row:{}});
    }

    this.handleOnClose = () => {
      this.setState({row:{}});
    }

  }

  updateEditQuantity(){
    console.log("edit");
    console.log(this.props.location);
    this.props.location.state.onSave(this.state.quantity, this.state.unitPrice);

  }

  updateQuantity(event){
    event.preventDefault();
    console.log("update quantity");
    var temp = this;
    // TODO: Fix this
    var re = /^\d*[1-9]\d*$/;
    var unsoldQty = temp.state.row.numUnsold;
    var quantity = event.target.value;
    if(quantity > unsoldQty){
      alert("sale quantity cannot be higher than the unsold quantity!");
    }else if (quantity == '' || (quantity>0 && re.test(event.target.value))){
      var quantity = (event.target.value > 0) ? Number(event.target.value) : 0;
      temp.setState({quantity: event.target.value});
      var revenue = (event.target.value > 0 ) ? (Math.round(quantity * Number(temp.state.unitPrice))*100/100): 0;
      temp.setState({revenue:revenue});
    }else{
       alert("Quantity must be a positive integer!");
    }
  };

  updateUnitPrice(event){
    event.preventDefault();
    console.log("updateUnitPrice");
    var temp = this;
    const re = /[0-9]+(\.([0-9]{4,}|000|00|0))?/
    // const re = /^\d[0-9](\.\d{0,2})?$/;
    // const re =  /^\d{0,10}(\.\d{0,2})?$/;
    if (event.target.value == '' || event.target.value == 0 || (event.target.value > 0 && re.test(event.target.value))) {

       var unitPrice = (event.target.value > 0) ? Number(event.target.value) : 0;
       var revenue = (event.target.value > 0 ) ? (Math.round(Number(temp.state.quantity) * unitPrice)*100/100): 0;
       temp.setState({unitPrice: event.target.value });
       temp.setState({revenue:revenue});
    }else{
      alert(" Unit price must be a number greater than or equal to 0.");
    }
  }

  quantitySaveValid(){
    console.log("check if save quantity valid");
    var temp = this;
    var quantity = temp.state.quantity;
    var unitPrice = temp.state.unitPrice;

    if(quantity && unitPrice){
      if(quantity == '' || quantity == 0){
        console.log("null value ");
        return false;
      }else{
        return true;
      }
    }
    return false;
  }



  render() {
    const { quantity,unitPrice,row} = this.state;
    return (
      <div>
      <Paper>
        <Dialog
          open={(row) ? Object.keys(row).length!=0 : false}
          onClose={this.handleOnClose}
          // classes={{ paper: classes.dialog }}
        >
      <DialogTitle>Edit Quantity and unit Price </DialogTitle>
      <DialogContent>
        <Paper>
          <TextField
            required
            margin="dense"
            id="quantity"
            label="Enter Quantity"
            value = {quantity}
            fullWidth = {false}
            onChange={(event) => this.updateQuantity(event)}
            // verticalSpacing= "desnse"
            style={{
            marginLeft: 20,
            martginRight: 20
            }}/>

            <TextField
              required
              margin="dense"
              id="unitPrice"
              label="Enter Unit Price ($)"
              value = {unitPrice}
              fullWidth = {false}
              onChange={(event) => this.updateUnitPrice(event)}
              // verticalSpacing= "desnse"
              style={{
              marginLeft: 20,
              martginRight: 20
              }}/>
        </Paper>
        <span>Revenue : $ {this.state.revenue}</span>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={this.cancelEdit}
          color="secondary"
          component = {Link} to = "/distribution-network"
          >Cancel</Button>
        <Button
          disabled = {!this.quantitySaveValid()}
          onClick={(event) => this.updateEditQuantity(event)}
          color="primary">SAVE</Button>
      </DialogActions>
    </Dialog>
  </Paper>
</div>
);
}
}
export default EditQuantity;
