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
    this.props.handleChange(this.lotNumberArray);
  }

  handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
  }

  handleCancel(){
    this.setState({open:false});
  }

  handleSave(){
    //send it to backend? or not yet
    this.setState({open:false});
  }

  handleClickOpen(){
    this.setState({
      open: true,
    });
  }

  render() {
    return (
      <TableCell>
        <Button raised onClick={this.handleClickOpen()}>Edit Lot Numbers</Button>
        <Dialog open={this.state.open} >
            <DialogTitle>Edit Lot Number</DialogTitle>
            <DialogContent>
              <Paper>
              <LotNumberSelector quantity={this.props.quantity} updateArray={this.updateArray} totalAssigned={this.state.totalAssigned}/>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCancel} color="primary">Cancel</Button>
              <Button onClick={this.handleSave} color="secondary">Save</Button>
            </DialogActions>
          </Dialog>
      </TableCell>
    );
  }
}

export default LotNumberButton
