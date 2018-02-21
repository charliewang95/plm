import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Delete from 'material-ui-icons/Delete';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class VendorItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount(){
    console.log("I am in vendoritem");
    console.log(this.props.vendorsArray);
  }

  render() {
     const { classes } = this.props;
    return (
    	<div style={{marginLeft:10}}>
   
      {this.props.vendorsArray && this.props.vendorsArray.map((vendor,index)=>(

          <div>
          

     {vendor.vendorName}
       <FormControl >
       
          <Input
            id="adornment-amount"
            value={vendor.price}
            style={{marginLeft: 10, width:50}}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        <IconButton aria-label="Delete" onClick={()=>{this.props.deleteVendor(index, vendor.vendorName);}}>
  
          <RemoveCircleIcon />
          </IconButton>

        

        </div>
      ))}

      </div>
    );
  }
}

VendorItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default VendorItem
