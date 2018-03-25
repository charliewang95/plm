import React, {Component} from 'react';
import LotNumberSelector from './LotNumberSelector.js';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import { TableCell } from 'material-ui/Table';


class LotNumberButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      lotNumberArray: [],
      totalAssigned: 0,
      open: false,
    };
    this.updateArray = this.updateArray.bind(this);
  }

  updateArray(inputArray){
    var sum = 0;
    for(var i=0; i<inputArray.length;i++){
      sum+=parseInt(inputArray[i].package);
      console.log(inputArray[i].package);
    }
    if(!sum){
      sum=0;
    }
    console.log("current sum " + sum);
    this.setState({lotNumberArray:inputArray});
    this.setState({totalAssigned:sum});
    this.props.handleChange(this.state.lotNumberArray);
  }

  handleChange = name => event => {
    console.log(" changed lot number");
    console.log(event.target.value);
      this.setState({
        [name]: event.target.value,
      });
  }

  handleCancel(e){
    e.preventDefault();
    this.setState({open:false});
    this.setState({lotNumberArray:[]});
  }

  handleSave(e){
    console.log("save lots");
    e.preventDefault();
    //send it to backend? or not yet
    this.setState({open:false});
  }

  handleClickOpen(e){
    e.preventDefault();
    this.setState({
      open: true,
    });
    // e.stopPropagation();
  }

  render() {
    return (
      <TableCell>
        <Button raised onClick={(e)=>this.handleClickOpen(e)}>Edit Lot Numbers</Button>
        <Dialog open={this.state.open} >
            <DialogTitle>Edit Lot Number</DialogTitle>
            <DialogContent>
              <Paper>
              <LotNumberSelector quantity={this.props.quantity} updateArray={this.updateArray} totalAssigned={this.state.totalAssigned}/>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={(e)=>this.handleCancel(e)} color="primary">Cancel</Button>
              <Button onClick={(e)=>this.handleSave(e)} color="secondary">Save</Button>
            </DialogActions>
          </Dialog>
      </TableCell>
    );
  }
}

export default LotNumberButton
