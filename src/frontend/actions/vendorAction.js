//vendorAction.js
//import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/vendors';
const property = 'vendor';

/* add one vendor
 * vendor: JSON object
 * sessionId: string
 */
function addVendor(vendor, sessionId) {
	return genericActions.create(baseUrl, vendor, sessionId);
};

/* 
 * get all vendors
 * deprecated, use getAllVendorsAsync() instead
 */
 /*
function getAllVendors() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all vendors
 * sessionId: string, id of the current session
 */
function getAllVendorsAsync(sessionId){
	return genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one vendor specified by an id
 * deprecated, use getVendorAsync() instead
 * vendorId: string, the id of the vendor
 */
 /*
function getVendor(vendorId) {
	return genericActions.getById(vendorId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one vendor specified by an id
 * vendorId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
function getVendorAsync(vendorId, sessionId){
	return genericActions.getByIdAsync(baseUrl, property, vendorId, sessionId);
};

/* 
 * update one vendor information
 * vendorId: string, the id of the vendor
 * sessionId: string, id of the current session
 * vendor: JSON object representing the updated info about the vendor
 */
function updateVendor(vendorId, sessionId, vendor) {
	return genericActions.updateById(baseUrl, property, vendorId, sessionId, vendor);
};

/* 
 * delete one existing vendor
 * vendorId: string, the id of the vendor
 * sessionId: string, id of the current session
 */
function deleteVendor(vendorId, sessionId) {
	return genericActions.deleteById(baseUrl, property, vendorId, sessionId);
};

//export functions above for use by other modules
export { addVendor, getAllVendorsAsync, getVendorAsync, updateVendor, deleteVendor};