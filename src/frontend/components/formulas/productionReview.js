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
import * as productActions from '../../interface/productInterface';
import SnackBarDisplay from '../snackBar/snackBarDisplay';

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
    this.state = {
      columns:[],
      formulaColumns: [
        { name: 'name', title: 'Name' },
        { name: 'description', title: 'Description' },
        { name: 'unitsProvided', title: 'Product Units ' },
        { name: 'ingredients', title: 'Ingredient / Quantity' },
        {key: 'sendToProd', title:''},
      ],
        formulaRows:(props.location.state) ? [props.location.state.selectedFormula] : [],
        open : true,
        columns:[
          {name: "ingredientName" , title: "Ingredient Name " },
          {name: "totalAmountNeeded" , title: "Amount Needed"},
          {name: "currentUnit" , title: "Amount In Stock"},
          {name: "delta" , title:'Additional Required Amount'},
        ],
        rows:[],
        addedQuantity:(props.location.state) ? (props.location.state.selectedFormula.unitsProvided) : '',
        // needToOrderIngredients:false,
        ingredientsToOrder:[],
        snackBarMessage:'',
        snackBarOpen:false,
        afterLink:'',
    };
    // this.cancelProduction = this.cancelProduction.bind(this);
    this.cancelProduction =() =>
      this.setState({
        formulaRows:[],
        open: false,
      });
    console.log(this.state.formulaRows);

    this.productionReview = async() =>{

      //TODO: Remove this

      console.log(" get production review");

      var temp = this;
      var afterLink = this.state.formulaRows[0].isIntermediate? '/admin-ingredients' : '/product';
      this.setState({afterLink: afterLink});

      //TODO: Check this
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
                 console.log(review);

                 var review = [...review.map((row, index)=> ({
                     id:index,...row,
                     delta:Math.round(row.delta*100)/100,
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
                     }
                   }
                    console.log(data);
                   temp.setState({ingredientsToOrder:data});
                   temp.setState({open:false});

                   temp.setState({snackBarMessage : "Formula successfully sent to production. "});
                   temp.setState({snackBarOpen:true});
              }
      });

      console.log(" OPEN PROD " + this.state.snackBarOpen);
      console.log(" MSG " + this.state.snackBarMessage);
    }

    console.log('preview constructed');
    this.addToShoppingCart = this.addToShoppingCart.bind(this);
    this.checkOutFormula = this.checkOutFormula.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
    console.log('everything binded');
  }


  async addToShoppingCart(event){
    //TODO: send to back end
    var temp = this;
    console.log("add To cart" + JSON.stringify(this.state.ingredientsToOrder));
    // ADD the ingredients with needed amount to
    // var success = false;
    console.log(temp.state.ingredientsToOrder);
    for(var i = 0; i < temp.state.ingredientsToOrder.length;i++){
      var row = temp.state.ingredientsToOrder[i];
      var vendorName = "";
      var price = 0;
      var _package = Math.ceil(row.delta / row.numUnitPerPackage);
      var vendors = row.vendors;
      vendors.sort(function(a, b) {return a.price - b.price });
      vendorName = vendors[0].vendorName;
      price = vendors[0].price;

      console.log(" ADD ORDER ");
      // TODO: CHANGE THIS
      var ingredientLots = [];
      var temp = this;
      await orderActions.addOrder(userId,row.ingredientId,
        row.ingredientName,vendorName,_package,price,ingredientLots,sessionId,function(res){
        //TODO: Please update this
        console.log(res.status);
        if(res.status == 400){
          alert(res.data);
        }else{
          // success = true;
          temp.setState({snackBarMessage : "Ingredients Successfully added to cart. "});
          temp.setState({snackBarOpen:true});
        }
      });
    }
    //TODO: Snackbar

    event.stopPropagation();
  }

  async checkOutFormula(event){

    var temp = this;
    console.log(temp.state.formulaRows[0]);
    await formulaActions.checkoutFormula("checkout",temp.state.formulaRows[0]._id,
                              Number(temp.state.addedQuantity),
                              sessionId, function(res){
         if (res.status == 400) {
            alert(res.data);
         } else {
            alert('Successfully added to production.');
         }
      });
    event.stopPropagation();
  };

  handleFormulaQuantity(event){
  const re = /^\d*\.?\d*$/;
      if (event.target.value == '' || (event.target.value>0 && re.test(event.target.value))) {
         this.setState({addedQuantity: event.target.value})
      }else{
        alert(" Quantity must be a positive number.");
      }
  }

  componentWillMount(){
    console.log(" Formula Rows " + JSON.stringify(this.state.formulaRows));
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;
  }


  handleOnClose(){
    this.setState({open:false});
  }

  handleSnackBarClose(){
    this.setState({snackBarOpen:false});
    this.setState({snackBarMessage: ''});
  }

  render() {
    // const {classes} = this.props;
    // const { classes } = this.props;
    const {formulaRows,rows,columns,formulaColumns, } = this.state;
    return (
      <div>
      <p><font size="6">Production Review</font></p>
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

      {this.state.snackBarOpen && <SnackBarDisplay
            open = {this.state.snackBarOpen}
            message = {this.state.snackBarMessage}
            handleSnackBarClose = {this.handleSnackBarClose}
          /> }

          <Dialog
            open={this.state.open}
            onClose={this.handleOnClose}
          >
            <DialogTitle>Check out to production</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure to produce this formula?
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
                  label="Enter Quantity"
                  value = {this.state.addedQuantity}
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
        {(this.state.ingredientsToOrder.length!=0) && <p><font size="5">You do not have enough ingredients. Order the difference?</font></p>}
        {(this.state.ingredientsToOrder.length!=0) &&
          <Tooltip id="tooltip-bottom" title="Ingredients with additional amount > 0 added to cart " placement="bottom">
            <RaisedButton raised
                  color="primary"
                  // className=classes.button
                  style={styles.orderIngredientsButton}
                  onClick = {(event) => this.addToShoppingCart(event)}
                  component = {Link} to = "/cart"
                  primary="true"> Order Ingredients </RaisedButton>
          </Tooltip> }

          {(this.state.ingredientsToOrder.length==0) &&
            <Tooltip id="tooltip-bottom" title="Send formula to production" placement="bottom">
              <RaisedButton raised
                    color="primary"
                    // className=classes.button
                    style={styles.orderIngredientsButton}
                    onClick = {(event) => this.checkOutFormula(event)}
                    component = {Link} to = {this.state.afterLink}
                    primary="true">Send to production</RaisedButton>
            </Tooltip>}
        <RaisedButton color="default"
        raised
          component={Link} to='/formula'
          style = {{marginLeft: 10}}
          > BACK </RaisedButton>
     </div>
   </div>
    );
  }
}

export default ProductionReview;
