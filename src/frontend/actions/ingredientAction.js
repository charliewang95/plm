//ingredientAction.js
import axios from 'axios';

/* add one ingredient
 * ingredient: JSON object
 */
function addIngredient(ingredient) {
	axios.post('/ingredients', ingredient)
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
function getIngredients() {
	axios.get('/ingredients')
	.then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error);
	});
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