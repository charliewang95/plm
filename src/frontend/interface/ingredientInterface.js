//ingredientInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyIngredient from '../dummyDatas/ingredient.js'
import * as ingredientActions from '../actions/ingredientAction'
import axios from 'axios'

/**
takes in various properties of ingredient,
returns a Json object that encapsulates all properties
name: string
packageType: string 'Sack', 'Pail', 'Drum', 'Supersack', 'Truckload', 'Railcar', or lowercase
temperatureZone: string 'freezer', 'refrigerator', 'warehouse', 'Freezer', 'Refrigerator', 'Warehouse'
vendors: array of objects following the VendorPriceSchema
**/
function packIntoJson(name, packageType, temperatureZone, vendors, moneySpent, moneyProd){
	var ingredientJson = new Object();
	ingredientJson.name = name;
	ingredientJson.packageName = packageType;
	ingredientJson.temperatureZone = temperatureZone;
	ingredientJson.vendors = vendors;
	ingredientJson.moneySpent = moneySpent;
	ingredientJson.moneyProd = moneyProd;
	console.log(vendors);
	return ingredientJson;
}

/* add one ingredient
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addIngredient(name, packageType, temperatureZone, vendors, sessionId, callback) {
	console.log("add ingredients");
	var newIngredient = packIntoJson(name, packageType, temperatureZone, vendors, 0, 0);
	//return await ingredientActions.addIngredient(newIngredient, sessionId);
	ingredientActions.addIngredient(newIngredient, sessionId, function(res){
	    callback(res);
	})
}

//async function bulkImport(object) {
//    try {
//        const res = await axios.post('/ingredients/bulkImport', object);
//        const result = res.data;
//        console.log(result);
//        callback(res);
//    }
//    catch(e) {
//      console.log('there was an error');
//      console.log(e);
//      //TODO: different error message for different types of error
//      if (e.response.status == 400 || e.response.status == 500)
//        callback(e.response);
//      else {
//        console.log(e.response);
//        throw e;
//      }
//    }
//}

/**
 * get all ingredients
 * sessionId: string, id of the current session
**/
async function getAllIngredientsAsync(sessionId) {
	return await ingredientActions.getAllIngredientsAsync(sessionId);
}

/*
 * get one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function getIngredientAsync(ingredientId, sessionId) {
	return await ingredientActions.getIngredientAsync(ingredientId, sessionId);
};

async function getAllIngredientNamesAsync(sessionId) {
   const res = await axios.get('/ingredients/ingredientNames/user/'+sessionId);
   return res;
}
/*
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateIngredient(ingredientId, name, packageType, temperatureZone, vendors, moneySpent, moneyProd, sessionId, callback) {
	var updatedIngredient = packIntoJson(name, packageType, temperatureZone, vendors, moneySpent, moneyProd);
	//return await ingredientActions.updateIngredient(ingredientId, sessionId, updatedIngredient);
	ingredientActions.updateIngredient(ingredientId, sessionId, updatedIngredient, function(res){
	    callback(res);
	})
};

/*
 * delete one existing ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function deleteIngredient(ingredientId, sessionId) {
	return await ingredientActions.deleteIngredient(ingredientId, sessionId);
};

//export functions above for use by other modules
export { addIngredient, getAllIngredientsAsync, getIngredientAsync, updateIngredient, deleteIngredient, getAllIngredientNamesAsync};
