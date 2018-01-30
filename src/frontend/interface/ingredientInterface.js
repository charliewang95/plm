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
vendors: array of strings
**/
function packIntoJson(name, packageType, temperatureZone, vendors){
	var ingredientJson = new Object();
	ingredientJson.name = name;
	ingredientJson.package = packageType;
	ingredientJson.temperatureZone = temperatureZone;
	ingredientJson.vendors = vendors;
	console.log("JSON");
	console.log(object);
	console.log(dummyIngredient.sampleIngredient);
	return ingredientJson;
}

/* add one ingredient
 * for arguments see packIntoJson
 */
function addIngredient(name, packageType, temperatureZone, vendors) {
	var newIngredient = packIntoJson(name, packageType, temperatureZone, vendors);
	ingredientActions.addIngredient(newIngredient);
}

async function getIngredients() {
	const res = await axios.get('/ingredients');
	return res;
}