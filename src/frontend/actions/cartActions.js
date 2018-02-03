//cartAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/carts';
const property = 'cart'; 

/* create a new cart for the user
 * cart: JSON object following cart.server.model.js
 * sessionId: string, id of the current session
 */
function addCart(cart, sessionId) {
	return genericActions.create(baseUrl,cart,sessionId);
};

/* 
 * get all carts
 * sessionId: string, id of the current session
 */
function getAllCartsAsync(sessionId){
	return genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */

function getCartAsync(cartId, sessionId){
	return genericActions.getByIdAsync(baseUrl, property, cartId, sessionId);
};

/* 
 * update one cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 * cart: JSON object representing the updated info about the cart
 */
function updateCart(cartId, sessionId, cart) {
	return genericActions.updateById(baseUrl, property, cartId, sessionId, cart);
};

/* 
 * delete one existing cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */
function deleteCart(cartId, sessionId) {
	return genericActions.deleteById(baseUrl, property, cartId, sessionId);
};

/*
 * checkout a cart pertaining to a particular session
 * sessionId: string, id of the current session
 */
function checkoutCart(sessionId) {
	const checkoutSegment = 'checkout';
	return genericActions.deleteAll(baseUrl, checkoutSegment, sessionId);
};

//export functions above for use by other modules
export { addCart, getAllCartsAsync, getCartAsync, updateCart, deleteCart, checkoutCart};