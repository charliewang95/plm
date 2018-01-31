//vendorInterface.js
//This interface is to be used by the front-end 
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyVendor from '../dummyDatas/vendor.js'
import * as vendorActions from '../actions/vendorAction'

/**
takes in various properties of vendor,
returns a Json object that encapsulates all properties 
name: string
contact: string 
code: string
ingredients: an array of id of ingredients the vendor is selling
**/
function packIntoJson(name, contact, code, ingredientIds){
	var vendorJson = new Object();
	vendorJson.name = name;
	vendorJson.contact = contact;
	vendorJson.code = code;
	vendorJson.codeUnique = code.toLowerCase();
	vendorJson.ingredients = ingredientIds;
	console.log("JSON");
	console.log(vendorJson);
	console.log(dummyVendor.sampleVendor);
	return vendorJson;
}

/* add one vendor
 * for arguments see packIntoJson
 */
function addVendor(name, contact, code, ingredientIds) {
	var newVendor = packIntoJson(name, contact, code, ingredientIds);
	vendorActions.addVendor(newVendor);
}

/**
 * get all vendors
**/
function getAllVendorsAsync() {
	return vendorActions.getAllVendorsAsync();
}

/* 
 * get one vendor
 * vendorId: string, the id of the vendor
 */
function getVendorAsync(vendorId) {
	return vendorActions.getVendorAsync(vendorId));
};

/* 
 * update one vendor
 * vendorId: string, the id of the vendor
 * other arguments: see packIntoJson()
 */
function updateVendor(vendorId, name, contact, code, ingredientIds) {
	var updatedVendor = packIntoJson(name, contact, code, ingredientIds);
	return vendorActions.updateVendor(vendorId, updatedVendor);
};

/* 
 * delete one existing vendor
 * vendorId: string, the id of the vendor
 */
function deleteVendor(vendorId) {
	return vendorActions.deleteById(vendorId);
};

//export functions above for use by other modules
export { addVendor, getAllVendorsAsync, getVendorAsync, updateVendor, deleteVendor};