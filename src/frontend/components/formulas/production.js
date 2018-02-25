import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import {
  Grid,
  Table,
  TableHeaderRow,TableEditColumn,PagingPanel,TableEditRow,
} from '@devexpress/dx-react-grid-material-ui';
import TextField from 'material-ui/TextField';


class ProductionReview extends React.Component {
  constructor(props) {
    super(props);
    // var dummyObject = new Object();
    // const selectedFormula = (props.location.state.selectedFormula)?(props.location.state.selectedFormula):dummyObject;
    this.state = {
      columns:[],
      formulaColumns: [
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'unitsProvided', title: 'Product Units ' },
        { name: 'ingredients', title: 'Ingredient / Quantity' },
        {key: 'sendToProd', title:''},
      ],
        formulaRows:(props.location.state.selectedFormula) ? [props.location.state.selectedFormula] : [],
        open : true,
        rows:[],
        addedQuantity:'',
    };
    // this.cancelProduction = this.cancelProduction.bind(this);
    this.cancelProduction =() =>
      this.setState({
        formulaRows:[],
        open: false,
      });
    this.sendToProduction = () =>{
      this.setState({open:false});
      console.log(" SEND TO PRODUCTION HERE ");
    }

  }

  handleFormulaQuantity(event){
  const re = /^[0-9\b]+$/;
      if (event.target.value == '' || re.test(event.target.value)) {
         this.setState({addedQuantity: event.target.value})

      }else{
        alert(" Quantity must be a number.");
      }
  }

  componentWillMount(){
    console.log(" Formula Rows " + JSON.stringify(this.state.formulaRows));
  }

  sendToProduction(){
    alert(" SEND TO PROD ");
    this.setState({open:false});
  }

    cancel(){
      this.setState({open:false});
    }

  handleOnClose(){
    this.setState({open:false});
  }

  render() {
    // const {classes} = this.props;
    const { selectedFormula } = this.state;
    return (
      <Paper>
      <Divider/>
          <Dialog
            open={this.state.open}
            onClose={this.handleOnClose}
            // classes={{ paper: classes.dialog }}
          >
            <DialogTitle>Check out to production</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to move this ingredient to production?
              </DialogContentText>
              <Paper>
                <Grid
                  rows={this.state.formulaRows}
                  columns={this.state.formulaColumns}
                >
                  <Table/>
                  <TableHeaderRow />
                </Grid>
              </Paper>
              <Divider />
              <Paper>
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  id="quantity"
                  label="Enter Quantity (lbs)"
                  fullWidth = {false}
                  onChange={(event) => this.handleFormulaQuantity(event)}
                  // verticalSpacing= "desnse"
                  style={{
                  marginLeft: 20,
                  martginRight: 20
                  }}/>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.cancelProduction} color="primary">Cancel</Button>
              <Button onClick={this.sendToProduction} color="secondary">Add To Production</Button>
            </DialogActions>
          </Dialog>
      </Paper>
    );
  }
}


export default ProductionReview;
