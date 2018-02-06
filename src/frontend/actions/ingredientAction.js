//ingredientAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/ingredients';
const property = 'ingredient'; 

/* add one ingredient
 * ingredient: JSON object
 * sessionId: string, id of the current session
 */
async function addIngredient(ingredient, sessionId) {
	return await genericActions.create(baseUrl,ingredient,sessionId);
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
async function getAllIngredientsAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
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
async function getIngredientAsync(ingredientId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, ingredientId, sessionId);
};

/* 
 * update one ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 * ingredient: JSON object representing the updated info about the ingredient
 */
async function updateIngredient(ingredientId, sessionId, ingredient) {
	return await genericActions.updateById(baseUrl, property, ingredientId, sessionId, ingredient);
};

/* 
 * delete one existing ingredient
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
async function deleteIngredient(ingredientId, sessionId) {
	return await genericActions.deleteById(baseUrl, property, ingredientId, sessionId);
};

//export functions above for use by other modules
export { addIngredient, getAllIngredientsAsync, getIngredientAsync, updateIngredient, deleteIngredient};