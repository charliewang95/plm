//ingredientInterface.js
//This interface is to be used by the front-end 
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyIngredient from '../dummyDatas/ingredient.js'
import * as ingredientActions from '../actions/ingredientAction'

/**
takes in various properties of ingredient,
returns a Json object that encapsulates all properties 
name: string
packageType: string 'Sack', 'Pail', 'Drum', 'Supersack', 'Truckload', 'Railcar', or lowercase
temperatureZone: string 'freezer', 'refrigerator', 'warehouse', 'Freezer', 'Refrigerator', 'Warehouse'
vendors: array of objects following the VendorPriceSchema
**/
function packIntoJson(name, packageType, temperatureZone, vendors){
	var ingredientJson = new Object();
	ingredientJson.name = name;
	ingredientJson.package = packageType;
	ingredientJson.temperatureZone = temperatureZone;
	ingredientJson.vendors = vendors;
	console.log("JSON");
	console.log(ingredientJson);
	console.log(dummyIngredient.sampleIngredient);
	return ingredientJson;
}

/* add one ingredient
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
function addIngredient(name, packageType, temperatureZone, vendors, sessionId) {
	var newIngredient = packIntoJson(name, packageType, temperatureZone, vendors);
	ingredientActions.addIngredient(newIngredient, sessionId);
}

/**
 * get all ingredients
 * sessionId: string, id of the current session
**/
function getAllIngredientsAsync(sessionId) {
	return ingredientActions.getAllIngredientsAsync(sessionId);
}

/* 
 * get one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
function getIngredientAsync(ingredientId, sessionId) {
	return ingredientActions.getIngredientAsync(ingredientId, sessionId);
};

/* 
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
function updateIngredient(ingredientId, name, packageType, temperatureZone, vendors, sessionId) {
	var updatedIngredient = packIntoJson(name, packageType, temperatureZone, vendors);
	return ingredientActions.updateIngredient(ingredientId, sessionId, updatedIngredient);
};

/* 
 * delete one existing ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */

function deleteIngredient(ingredientId, sessionId) {
	return ingredientActions.deleteIngredient(ingredientId, sessionId);
};

//export functions above for use by other modules
export { addIngredient, getAllIngredientsAsync, getIngredientAsync, updateIngredient, deleteIngredient};