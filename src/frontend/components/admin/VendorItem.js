import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';

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
    return (
    	<div>
      {this.props.vendorsArray && this.props.vendorsArray.map((vendor,index)=>(
        <Grid container spacing={16} key={index}>
        <Grid item sm={7}>
         <Select
          name="Vendor Name"
          options={this.props.options}
          labelKey="name"
          valueKey="codeUnique"
          value={vendor.codeUnique}
          clearable = {false}
          onChange={(value)=>{this.props.updateId(value, index);}}
          />
        </Grid>
        <Grid item sm={3}>
          <TextField placeholder={vendor.price.toString()} onChange={(value)=>{this.props.updatePrice(value, index);}}/>
        </Grid>
        <Grid item sm={1}>
          <IconButton aria-label="Delete" onClick={()=>{this.props.deleteVendor(index);}}>
            <RemoveCircleIcon />
          </IconButton>
        </Grid>
      </Grid>
      ))}
      </div>
    );
  }
}

export default VendorItem