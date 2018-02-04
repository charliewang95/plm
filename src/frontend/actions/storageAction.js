//storageAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'

//All the methods return the response on successful completion
const baseUrl = '/storages';
const property = 'storage'; 

/* create a new storage for the user
 * storage: JSON object following storage.server.model.js
 * sessionId: string, id of the current session
 */
function addStorage(storage, sessionId) {
	return genericActions.create(baseUrl,storage,sessionId);
};

/* 
 * get all storages
 * sessionId: string, id of the current session
 */
function getAllStoragesAsync(sessionId){
	return genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 */

function getStorageAsync(storageId, sessionId){
	return genericActions.getByIdAsync(baseUrl, property, storageId, sessionId);
};

/* 
 * update one storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 * storage: JSON object representing the updated info about the storage
 */
function updateStorage(storageId, sessionId, storage) {
	return genericActions.updateById(baseUrl, property, storageId, sessionId, storage);
};

/* 
 * delete one existing storage
 * storageId: string, the id of the storage
 * sessionId: string, id of the current session
 */
function deleteStorage(storageId, sessionId) {
	return genericActions.deleteById(baseUrl, property, storageId, sessionId);
};

//export functions above for use by other modules
export { addStorage, getAllStoragesAsync, getStorageAsync, updateStorage, deleteStorage};