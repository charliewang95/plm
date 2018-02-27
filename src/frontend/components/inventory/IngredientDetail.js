
import React  from 'react';
import * as ingredientActions from '../../interface/ingredientInterface';
import * as testConfig from '../../../resources/testConfig.js'
import {
  Grid,
  Table,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import Paper from 'material-ui/Paper';


var sessionId = "";

class IngredientDetail extends React.PureComponent {

  constructor(props){
    super(props);
    this.state={
      rowDetail:"",
      vendorString:"",
    };
  }

  componentDidMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    this.loadIngredientDetail();
  }

  async loadIngredientDetail (){
    var row = this.props.row;
    try{
      var detail = await ingredientActions.getIngredientAsync(row.ingredientId,sessionId);
     }catch(e){
       console.log(" Error sent to front end");
       alert(e);
     }
    console.log(" Ingredient Details " + JSON.stringify(detail));
    console.log(" Money Spent " + detail.moneySpent);
    console.log(" Money Prod " + detail.moneyProd);
    var vendorString = ""

    // console.log(" Vendors " + JSON.stringify(detail.vendors));

    for(var i = 0; i < detail.vendors.length;i++){
      vendorString += detail.vendors[i].vendorName + ' / $ ' + detail.vendors[i].price;
      if( i != detail.vendors.length-1){
        vendorString+=" , ";
      }
    }

    console.log("vendorString " + vendorString);

    this.setState({rowDetail:detail});
    this.setState({vendorString: vendorString});

  }
      render(){
        const{rowDetail} = this.props;
      return (
          <div>
            <div> MoneySpent (Orders) :  {parseFloat(this.state.rowDetail.moneySpent)} </div>
            <div> MoneySpent (Production) :  {parseFloat(this.state.rowDetail.moneyProd)}  </div>
            <div> Vendors/Price:  {this.state.vendorString}  </div>
           </div>
      );
    }
};

export default IngredientDetail;
