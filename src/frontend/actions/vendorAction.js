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
 * deprecated, use getAllVendorsAsync() instead
 */
function getAllVendors() {
	return genericActions.getAll(baseUrl);
};

/* 
 * get all vendors
 * 
 */
function getAllVendorsAsync(){
	return genericActions.getAllAsync(baseUrl);
};

/* 
 * get one vendor specified by an id
 * deprecated, use getVendorAsync() instead
 * vendorId: string, the id of the vendor
 */
function getVendor(vendorId) {
	return genericActions.getById(vendorId, baseUrl.concat(property).concat('/') );
};

/* 
 * get one vendor specified by an id
 * vendorId: string, the id of the ingredient
 */
function getVendorAsync(vendorId){
	return genericActions.getByIdAsync(vendorId, baseUrl.concat(property).concat('/'));
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
export { addVendor, getAllVendors, getAllVendorsAsync, getVendor, getVendorAsync, updateVendor, deleteVendor};