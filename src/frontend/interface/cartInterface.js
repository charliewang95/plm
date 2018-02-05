//cartInterface.js
//This interface is to be used by the front-end 
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyCart from '../dummyDatas/cart.js'
import * as cartActions from '../actions/cartAction'

/**
takes in various properties of cart,
returns a Json object that encapsulates all properties 
userId: string, the id of the current user owning the cart
ingredientId: string, id of the type of ingredient this cart is holding
quantity: number, the amount of that type of ingredient in the cart, in units of pounds
**/
function packIntoJson(userId, ingredientId, ingredientName, quantity){
	var cartJson = new Object();
	cartJson.userId = userId;
	cartJson.ingredientId = ingredientId;
	cartJson.ingredientName = ingredientName;
	cartJson.quantity = quantity;
	console.log("JSON");
	console.log(cartJson);
	//console.log(dummyCart.sampleCart);
	return cartJson;
}

/* add one cart
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
function addCart(userId, ingredientId, ingredientName, quantity, sessionId) {
	var newCart = packIntoJson(userId, ingredientId, ingredientName, quantity);
	cartActions.addCart(newCart, sessionId);
}

/**
 * get all carts
 * sessionId: string, id of the current session
**/
async function getAllCartsAsync(sessionId) {
	return await cartActions.getAllCartsAsync(sessionId);
}

/* 
 * get one cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */
async function getCartAsync(cartId, sessionId) {
	return await cartActions.getCartAsync(cartId, sessionId);
};

/* 
 * update one cart
 * cartId: string, the id of the cart
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
function updateCart(cartId, userId, ingredientId, ingredientName, quantity, sessionId) {
	var updatedCart = packIntoJson(userId, ingredientId, quantity);
	return cartActions.updateCart(cartId, sessionId, updatedCart);
};

/* 
 * delete one existing cart
 * cartId: string, the id of the cart
 * sessionId: string, id of the current session
 */
function deleteCart(cartId, sessionId) {
	return cartActions.deleteCart(cartId, sessionId);
};

/*
 * checkout a cart pertaining to a particular session
 * sessionId: string, id of the current session
 */
function checkoutCart(sessionId){
	return cartActions.checkoutCart(sessionId);
};

//export functions above for use by other modules
export { addCart, getAllCartsAsync, getCartAsync, updateCart, deleteCart, checkoutCart};