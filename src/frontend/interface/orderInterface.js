//orderInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyOrder from '../dummyDatas/order.js'
import * as orderActions from '../actions/orderAction'

/**
takes in various properties of order,
returns a Json object that encapsulates all properties
userId: string, the id of the current user issueing the order
ingredientId: string, id of the type of ingredient being ordered
vendorId: string, string, id of the vendor that the user is ordering from
_package: number, the number of packages the user is ordering (package is a keyword in js)
price: number, the price of each package
**/
function packIntoJson(userId, ingredientId, vendorId, _package, price){
	var orderJson = new Object();
	orderJson.userId = userId;
	orderJson.ingredientId = ingredientId;
	orderJson.vendorId = vendorId;
	orderJson.packageNum = _package;
	orderJson.price = price;
	console.log("JSON");
	console.log(orderJson);
	console.log(dummyOrder.sampleOrder);
	return orderJson;
}

/* add one order
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addOrder(userId, ingredientId, vendorId, _package, price, sessionId) {
	var newOrder = packIntoJson(userId, ingredientId, vendorId, _package, price);
	return await orderActions.addOrder(newOrder, sessionId);
}

/**
 * get all orders
 * sessionId: string, id of the current session
**/
async function getAllOrdersAsync(sessionId) {
	return await orderActions.getAllOrdersAsync(sessionId);
}

/*
 * get one order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */
async function getOrderAsync(orderId, sessionId) {
	return await orderActions.getOrderAsync(orderId, sessionId);
};

/*
 * update one order
 * orderId: string, the id of the order
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateOrder(orderId, userId, ingredientId, vendorId, _package, price, sessionId) {
	var updatedOrder = packIntoJson(userId, ingredientId, vendorId, _package, price);
	return await orderActions.updateOrder(orderId, sessionId, updatedOrder);
};

/*
 * delete one existing order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */
async function deleteOrder(orderId, sessionId) {
	return await orderActions.deleteOrder(orderId, sessionId);
};

//export functions above for use by other modules
export { addOrder, getAllOrdersAsync, getOrderAsync, updateOrder, deleteOrder};
