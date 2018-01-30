//vendorAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/vendors';
const property = '/vendor';

/* add one vendor
 * vendor: JSON object
 */
function addVendor(vendor) {
	return genericActions.create(vendor,baseUrl);
};

/* 
 * get all vendors
 * 
 */
function getAllVendors() {
	return genericActions.getAll(baseUrl);
};

/* 
 * get one vendor specified by an id
 * vendorId: string, the id of the vendor
 */
function getVendor(vendorId) {
	return genericActions.getById(vendorId, baseUrl.concat(property).concat('/') );
};

/* 
 * update one vendor information
 * vendorId: string, the id of the vendor
 * vendor: JSON object representing the updated info about the vendor
 */
function updateVendor(vendorId, vendor) {
	return genericActions.updateById(vendorId, vendor, baseUrl.concat(property).concat('/') );
};

/* 
 * delete one existing vendor
 * vendorId: string, the id of the vendor
 */
function deleteVendor(vendorId) {
	return genericActions.deleteById(vendorId, baseUrl.concat(property).concat('/') );
};

//export functions above for use by other modules
export { addVendor, getAllVendors, getVendor, updateVendor, deleteVendor};