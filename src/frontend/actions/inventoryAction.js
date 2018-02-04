//inventoryAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/inventories';
const property = 'inventory'; 

/* create a new inventory for the user
 * inventory: JSON object following inventory.server.model.js
 * sessionId: string, id of the current session
 */
function addInventory(inventory, sessionId) {
	return genericActions.create(baseUrl,inventory,sessionId);
};

/* 
 * get all inventories
 * sessionId: string, id of the current session
 */
function getAllInventoriesAsync(sessionId){
	return genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */

function getInventoryAsync(inventoryId, sessionId){
	return genericActions.getByIdAsync(baseUrl, property, inventoryId, sessionId);
};

/* 
 * update one inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 * inventory: JSON object representing the updated info about the inventory
 */
function updateInventory(inventoryId, sessionId, inventory) {
	return genericActions.updateById(baseUrl, property, inventoryId, sessionId, inventory);
};

/* 
 * delete one existing inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */
function deleteInventory(inventoryId, sessionId) {
	return genericActions.deleteById(baseUrl, property, inventoryId, sessionId);
};

//export functions above for use by other modules
export { addInventory, getAllInventoriesAsync, getInventoryAsync, updateInventory, deleteInventory};