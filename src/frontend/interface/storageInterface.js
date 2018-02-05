//storageInterface.js
//This interface is to be used by the front-end
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyStorage from '../dummyDatas/storage.js'
import * as storageActions from '../actions/storageAction'

/**
takes in various properties of storage,
returns a Json object that encapsulates all properties
ingredientId: string, id of the type of ingredient being storageed
temperatureZone: string 'freezer', 'refrigerator', 'warehouse', 'Freezer', 'Refrigerator', 'Warehouse'
capacity: number, the maximum amount of the ingredient tha can be stored, in units of pounds
**/
function packIntoJson(temperatureZone, capacity){
	var storageJson = new Object();
	//storageJson.ingredientId = ingredientId;
	storageJson.temperatureZone = temperatureZone;
	storageJson.capacity = capacity;
	console.log("JSON");
	console.log(storageJson);
	console.log(dummyStorage.sampleStorage);
	return storageJson;
}

/* add one storage
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
function addStorage(temperatureZone, capacity, sessionId) {
	var newStorage = packIntoJson(temperatureZone, capacity);
	storageActions.addStorage(newStorage, sessionId);
}

/**
 * get all storages
 * sessionId: string, id of the current session
**/
function getAllStoragesAsync(sessionId) {
	return storageActions.getAllStoragesAsync(sessionId);
}

/*
 * get one storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 */
function getStorageAsync(storageId, sessionId) {
	return storageActions.getStorageAsync(storageId, sessionId);
};

/*
 * update one storage
 * storageId: string, the id of the storage
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
function updateStorage(storageId, temperatureZone, capacity, sessionId) {
	var updatedStorage = packIntoJson(temperatureZone, capacity);
	return storageActions.updateStorage(storageId, sessionId, updatedStorage);
};

/*
 * delete one existing storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 */
function deleteStorage(storageId, sessionId) {
	return storageActions.deleteStorage(storageId, sessionId);
};

//export functions above for use by other modules
export { addStorage, getAllStoragesAsync, getStorageAsync, updateStorage, deleteStorage};
