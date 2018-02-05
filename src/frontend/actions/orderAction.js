//orderAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/orders';
const property = 'order'; 

/* create a new order for the user
 * order: JSON object following order.server.model.js
 * sessionId: string, id of the current session
 */
function addOrder(order, sessionId) {
	return genericActions.create(baseUrl,order,sessionId);
};

/* 
 * get all orders
 * sessionId: string, id of the current session
 */
async function getAllOrdersAsync(sessionId){
	return await genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */

async function getOrderAsync(orderId, sessionId){
	return await genericActions.getByIdAsync(baseUrl, property, orderId, sessionId);
};

/* 
 * update one order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 * order: JSON object representing the updated info about the order
 */
function updateOrder(orderId, sessionId, order) {
	return genericActions.updateById(baseUrl, property, orderId, sessionId, order);
};

/* 
 * delete one existing order
 * orderId: string, the id of the order
 * sessionId: string, id of the current session
 */
function deleteOrder(orderId, sessionId) {
	return genericActions.deleteById(baseUrl, property, orderId, sessionId);
};

//export functions above for use by other modules
export { addOrder, getAllOrdersAsync, getOrderAsync, updateOrder, deleteOrder};