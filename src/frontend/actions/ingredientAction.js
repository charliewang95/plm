//ingredientAction.js
import axios from 'axios';
import * as dummyIngredient from '../dummyDatas/ingredient.js'
/* add one ingredient
 * ingredient: JSON object
 */
function addIngredient(name, packageType, temperatureZone, vendors) {
	var object = new Object();
	object.name = name;
	object.package = packageType;
	object.temperatureZone = temperatureZone;
	object.vendors = vendors;

	console.log("JSON");
	console.log(object);
	console.log(dummyIngredient.sampleIngredient);
	axios.post('/ingredients', object)
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * get all ingredients
 */
// function getIngredients() {
// 	axios.get('/ingredients')
// 	.then(function (response) {
// 		console.log(response);
// 		console.log("getIngredients was called in ingredientAction");
// 		return response;
// 	})
// 	.catch(function (error) {
// 		console.log(error);
// 	});
// };

async function getIngredients() {
	const res = await axios.get('/ingredients');
	return res;
};

/* 
 * get one ingredient
 * ingredientId: string, the id of the ingredient
 */
function getIngredient(ingredientId) {
	axios.get('/ingredients/ingredient/'.concat(ingredientId))
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * ingredient: JSON object representing the updated info about the ingredient
 */
function updateIngredient(ingredientId, ingredient) {
	axios.put('/ingredients/ingredient/'.concat(ingredientId), ingredient)
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * delete one existing ingredient
 */
function deleteIngredient(ingredientId) {
	axios.delete('/ingredients/ingredient/'.concat(ingredientId))
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});
};

export { addIngredient, getIngredients, getIngredient, updateIngredient, deleteIngredient};