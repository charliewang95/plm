
import React,{Component}  from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Styles from  'react-select/dist/react-select.css';
import { withStyles } from 'material-ui/styles';
import Input from 'material-ui/Input';
import { TableCell } from 'material-ui/Table';
import { MenuItem } from 'material-ui/Menu';


const styles = theme => ({
  VendorCell: {
    verticalAlign: 'top',
    paddingRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit * 1.25,
    paddingLeft: theme.spacing.unit,
  },
  });

class VendorCellOld extends Component{
  constructor(props){
    super (props);
    this.state = {
      vendorOptions : [],
      vendorID:"",
      vendorName:"",
      price:"",
    }
    this.handleVendorChange = this.handleVendorChange.bind(this);
}

  handleVendorChange(option){
    console.log(" option " + option.value);

    this.setState({vendorID:option.value});
    this.setState({price:option.price});
    this.setState({vendorName:option.vendorName});
    var vendorObject = new Object();
    vendorObject.vendorName=option.vendorName;
    vendorObject.vendorId=option.value;
    vendorObject.price=option.price;
    this.props.handleChange(vendorObject);
  }

  componentWillMount(){
    this.loadVendorsOptions();
  }

  loadVendorsOptions(){
    this.setState({vendorOptions:this.props.vendorOptions});
    this.setState({vendorID: this.props.value});
  }

  render(){
    return(
      <div>
      <Select
       // placeholder="Select New Vendor"
       name="Vendor"
       options={this.state.vendorOptions}
       // valueKey="ID"
       onChange={(option) => this.handleVendorChange(option)}
       value = {this.state.vendorID}
       />
     </div>
    );
  }
}

export default withStyles(styles, { name: 'VendorCellOld' })(VendorCellOld);
