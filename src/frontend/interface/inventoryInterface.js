//inventoryInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyInventory from '../dummyDatas/inventory.js'
import * as inventoryActions from '../actions/inventoryAction'

/**
takes in various properties of inventory,
returns a Json object that encapsulates all properties
userId: string, the id of the current user owning the inventory
ingredientId: string, id of the type of ingredient this inventory is holding
ingredientName: string, name of the ingredient
temperatureZone: string 'freezer', 'refrigerator', 'warehouse', 'Freezer', 'Refrigerator', 'Warehouse'
quantity: number, the amount of that type of ingredient in the inventory, in units of pounds
**/
function packIntoJson(userId, ingredientId, ingredientName, temperatureZone, packageName, quantity){
	var inventoryJson = new Object();
	inventoryJson.userId = userId;
	inventoryJson.ingredientId = ingredientId;
	inventoryJson.ingredientName = ingredientName;
	inventoryJson.temperatureZone = temperatureZone;
	inventoryJson.packageName = packageName;
	inventoryJson.quantity = quantity;
	console.log("JSON");
	console.log(inventoryJson);
	return inventoryJson;
}

/* add one inventory
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */

async function addInventory(userId, ingredientId, ingredientName, temperatureZone, packageName, quantity, sessionId) {
	var newInventory = packIntoJson(userId, ingredientId, ingredientName, temperatureZone, packageName, quantity);
	return await inventoryActions.addInventory(newInventory, sessionId);
}

/**
 * get all inventories
 * sessionId: string, id of the current session
**/
async function getAllInventoriesAsync(sessionId) {
	return await inventoryActions.getAllInventoriesAsync(sessionId);
}

/*
 * get one inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */
async function getInventoryAsync(inventoryId, sessionId) {
	return await inventoryActions.getInventoryAsync(inventoryId, sessionId);
};

/*
 * update one inventory
 * inventoryId: string, the id of the inventory
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */

async function updateInventory(inventoryId, userId, ingredientId, ingredientName, temperatureZone, packageName, quantity, sessionId) {
	var updatedInventory = packIntoJson(userId, ingredientId, ingredientName, temperatureZone, packageName, quantity);
	return await inventoryActions.updateInventory(inventoryId, sessionId, updatedInventory);
};

/*
 * delete one existing inventory
 * inventoryId: string, the id of the inventory
 * sessionId: string, id of the current session
 */
async function deleteInventory(inventoryId, sessionId) {
	return await inventoryActions.deleteInventory(inventoryId, sessionId);
};


//export functions above for use by other modules
export { addInventory, getAllInventoriesAsync, getInventoryAsync, updateInventory, deleteInventory};
