
import React from 'react';
import * as ingredientActions from '../../interface/ingredientInterface';
import * as testConfig from '../../../resources/testConfig.js'
import {
  Grid,
  Table,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import Paper from 'material-ui/Paper';

//TODO: Set sessionId
const sessionId = testConfig.sessionId;
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

const RowDetail = ({ row }) => (
  console.log("row" + row.ingredientName),
  // TODO: Call the ingredient interface to get details for the ingredient

  <div>Details for {row.ingredientName} from {row.temperatureZone}</div>
);

const dummyData = {_id: "ID1", name: "pepper",packageName: "sack",temperatureZone: "warehouse",
                    vendors: [{code: "ID1", price: "10"},{code: "ID2", price: "15"}],
                    moneySpent:"500", moneyProd: "400"};

const IngredientDetail  = ({row}) => {
  console.log("Details for " + row.ingredientName + " " + row.ingredientId);
  var ingredientDetail = "";
  if(READ_FROM_DATABASE){
     try{
        // TODO: load ingredient details from the backend
        ingredientDetail = ingredientActions.getIngredientAsync(row.ingredientId,sessionId);
        console.log(ingredientDetail);
       }catch(e){
         console.log(" Error sent to front end");
         alert(e);
       }
   }else{
    ingredientDetail = dummyData;
     }
    console.log(" Ingredient Details " + JSON.stringify(ingredientDetail));
    console.log(" Money Spent " + ingredientDetail.moneySpent);
    console.log(" Money Prod " + ingredientDetail.moneyProd);
    var vendorString = ""

    console.log("vendorString " + vendorString);
  return (
      <div>
        <div> MoneySpent (Orders): {ingredientDetail.moneySpent} </div>
        <div> MoneySpent (Production): {ingredientDetail.moneyProd}  </div>
       </div>
  );
};

export default IngredientDetail;
