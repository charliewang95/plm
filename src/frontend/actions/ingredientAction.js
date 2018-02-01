//ingredientAction.js
//import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/ingredients';
const property = 'ingredient'; 

/* add one ingredient
 * ingredient: JSON object
 * sessionId: string, id of the current session
 */
function addIngredient(ingredient, sessionId) {
	return genericActions.create(baseUrl,ingredient,sessionId);
};

/* 
 * get all ingredients
 * deprecated, use getAllIngredientsAsync instead
 */
 /*
function getAllIngredients() {
	return genericActions.getAll(baseUrl);
	
};
*/

/* 
 * get all ingredients
 * sessionId: string, id of the current session
 */
function getAllIngredientsAsync(sessionId){
	return genericActions.getAllAsync(baseUrl, sessionId);
};
/* 
 * get one ingredient
 * deprecated, use getIngredientAsync instead
 * ingredientId: string, the id of the ingredient
 */
 /*
function getIngredient(ingredientId) {
	return genericActions.getById(ingredientId, baseUrl.concat(property).concat('/'));
};
*/

/* 
 * get one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
function getIngredientAsync(ingredientId, sessionId){
	return genericActions.getByIdAsync(baseUrl, property, ingredientId, sessionId);
};

/* 
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 * ingredient: JSON object representing the updated info about the ingredient
 */
function updateIngredient(ingredientId, sessionId, ingredient) {
	return genericActions.updateById(baseUrl, property, ingredientId, sessionId, ingredient);
};

/* 
 * delete one existing ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
function deleteIngredient(ingredientId, sessionId) {
	return genericActions.deleteById(baseUrl, property, ingredientId, sessionId);
};

//export functions above for use by other modules
export { addIngredient, getAllIngredientsAsync, getIngredientAsync, updateIngredient, deleteIngredient};