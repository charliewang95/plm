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
import * as formulaActions from '../../interface/formulaInterface';
import Tooltip from 'material-ui/Tooltip';
import RaisedButton from 'material-ui/Button';
import * as orderActions from '../../interface/orderInterface';

import {reviewData} from './dummyData';

const styles = {
    buttons: {
      marginTop: 30,
      float: 'center'
    },
    orderIngredientsButton: {
      marginLeft: 50,
    },
  };


var userId;
var sessionId;
var isAdmin;

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

        columns:[
          {name: "ingredientName" , title: "Ingredient Name " },
          {name: "totalAmountNeeded" , title: "Amount Needed"},
          {name: "currentUnit" , title: "Amount In Stock"},
          {name: "delta" , title:'Additional Required Amount'},
        ],
        rows:[],
        addedQuantity:'',
        // needToOrderIngredients:false,
        ingredientsToOrder:[],
    };
    // this.cancelProduction = this.cancelProduction.bind(this);
    this.cancelProduction =() =>
      this.setState({
        formulaRows:[],
        open: false,
      });

    this.productionReview = async() =>{
      //TODO: add to cart
      sessionId = JSON.parse(localStorage.getItem('user'))._id;
      console.log(" get production review");
      // console.log(this.state.formulaRows[0]._id + " , " +
      //             parseInt(this.state.addedQuantity,10) + ", " + sessionId);

      // TODO: get
      var temp = this;
      console.log(this.state.formulaRows[0]._id+' '+Number(this.state.addedQuantity));
      await formulaActions.checkoutFormula("review",this.state.formulaRows[0]._id,
                          Number(this.state.addedQuantity),sessionId, function(res){
              if (res.status == 400) {
                if (!alert(res.data)){
                    return;
                }
              } else if (res.status == 500){
                alert(res.data)
              }

              else {
                 review = res.data;
                 var review = [...review.map((row, index)=> ({
                     id:index,...row,
                     })),
                   ];
                   // console.log(" Formula " + JSON.stringify(review));
                   temp.setState({rows:review});

                   // Check if you need to order the ingredients
                   var data = [];
                   for(var i =0; i < review.length;i++){
                     if(review[i].delta> 0 ){
                       // Add to the Array
                       data.push(review[i]);
                       // this.setState({needToOrderIngredients:true})
                     }
                   }

                   temp.setState({ingredientsToOrder:data});
                   temp.setState({open:false});
              }
      });
    }

    this.addToShoppingCart = this.addToShoppingCart.bind(this);
    this.checkOutFormula = this.checkOutFormula.bind(this);
  }


  async addToShoppingCart(){
    //TODO: send to back end
    userId = JSON.parse(localStorage.getItem('user'))._id;

    console.log("add To cart" + JSON.stringify(this.state.ingredientsToOrder));
    // ADD the ingredients with needed amount to
    var success = false;
    for(var i = 0; i < this.state.ingredientsToOrder.length;i++){
      var row = this.state.ingredientsToOrder[i];
      var vendorName = "";
      var price = 0;
      var _package = row.delta;
      await orderActions.addOrder(userId,row.ingredientName,vendorName,_package,price,sessionId,function(res){
        //TODO: Please update this
        if(res.status == 400){
          alert(res.data);
        }else{
          success = true;
        }
      });
    }

    //TODO: Snackbar
//    if(success){
//      alert("Ingredients successfully added to cart. Please check out your cart first to send this formula to production.")
//    }

  }

  async checkOutFormula(){
    //TODO: Checkout formula
    console.log(" checkout ");
    console.log(JSON.stringify(this.state));
//    await formulaActions.checkoutFormula("checkout",this.state.formulaRows[0]._id,
//                              Number(this.state.addedQuantity),sessionId, function(res){
//         if (res.status == 400) {
//            alert('Please order the missing ingredients to proceed.');
//         } else {
//            alert('Successfully added to production.');
//         }
//      });
    //TODO: Snackbar
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
    // console.log(" Formula Rows " + JSON.stringify(this.state.formulaRows));
    isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
  }

    cancel(){
      this.setState({open:false});
    }

  handleOnClose(){
    this.setState({open:false});
  }

  render() {
    // const {classes} = this.props;
    const {formulaRows,rows,columns,formulaColumns, } = this.state;
    return (
      <div>
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
        >
          {/* <DragDropProvider /> */}
          <Table />
          <TableHeaderRow  />
        </Grid>
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
              <Button
                onClick={this.cancelProduction}
                color="primary"
                component = {Link} to = "/formula"
                >Cancel</Button>
              <Button
                component = {Link} to = "/production-review"
                onClick={this.productionReview} color="secondary">Add To Production</Button>
            </DialogActions>
          </Dialog>
      </Paper>
      <div style={styles.buttons}>
        {(this.state.ingredientsToOrder.length!=0) &&
          <Tooltip id="tooltip-bottom" title="Ingredients with additional amount > 0 added to cart " placement="bottom">
            <RaisedButton raised
                  color="primary"
                  // className=classes.button
                  style={styles.orderIngredientsButton}
                  onClick = {this.addToShoppingCart()}
                  primary="true"> Order Ingredients </RaisedButton>
          </Tooltip> }

          {(this.state.ingredientsToOrder.length==0) &&
            <Tooltip id="tooltip-bottom" title="Send formula to production" placement="bottom">
              <RaisedButton raised
                    color="primary"
                    // className=classes.button
                    style={styles.orderIngredientsButton}
                    onclick = {this.checkOutFormula()}
                    primary="true">Send to production</RaisedButton>
            </Tooltip>}

        <RaisedButton color="default"
          component={Link} to='/formula'
          style = {{marginTop: 5, marginLeft: 5}}
          > BACK </RaisedButton>
     </div>
   </div>
    );
  }
}


export default ProductionReview;
