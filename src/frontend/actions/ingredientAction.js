//ingredientAction.js
import axios from 'axios';
import * as genericActions from './genericCrudActions'
//All the methods return the response on successful completion

const baseUrl = '/ingredients';
const property = '/ingredient'; 
/* add one ingredient
 * ingredient: JSON object
 */
function addIngredient(ingredient) {
	return genericActions.create(ingredient,baseUrl);
};

/* 
 * get all ingredients
 * 
 */
function getAllIngredients() {
	return genericActions.getAll(baseUrl);
};

/* 
 * get one ingredient
 * ingredientId: string, the id of the ingredient
 */
function getIngredient(ingredientId) {
	return genericActions.getById(ingredientId, baseUrl.concat(property).concat('/') );
};

/* 
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * ingredient: JSON object representing the updated info about the ingredient
 */
function updateIngredient(ingredientId, ingredient) {
	return genericActions.updateById(ingredientId, ingredient, baseUrl.concat(property).concat('/') );
};

/* 
 * delete one existing ingredient
 */
function deleteIngredient(ingredientId) {
	return genericActions.deleteById(ingredientId, baseUrl.concat(property).concat('/') );
};

//export functions above for use by other modules
export { addIngredient, getAllIngredients, getIngredient, updateIngredient, deleteIngredient};