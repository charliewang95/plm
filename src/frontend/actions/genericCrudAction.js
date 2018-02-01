//CrudActions.js
//defines CRUD functions that are common to database operations
import axios from 'axios';

//All the methods return the response on successful completion

/* create a new entry in the database
 * object: JSON object
 * url: string, the url for the post request
 */
function create(object,url) {
	axios.post(url, object)
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * get all objects of a kind
 * url: string, the url for the get request
 */
function getAll(url) {
	//deprecated because somehow front end does not work?
	//use getAllAsync instead
	axios.get(url)
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * get all objects of a kind
 * url: string, the url for the get request
 */
async function getAllAsync(url) {
	const res = await axios.get(url);
	return res;
}

/* 
 * get one object with a specfic id
 * deprecated, use getByIdAsync instead
 * objectId: string, the id of the ingredient
 * url: string, the url for the get request
 */
function getById(objectId, url) {
	axios.get(url.concat(objectId))
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * get one object with a specfic id
 * objectId: string, the id of the ingredient
 * url: string, the url for the get request
 */
async function getByIdAsync(objectId, url) {
	const res = await axios.get(url.concat(objectId));
	return res;
};

/* 
 * update one existing object by Id
 * objectId: string, the id of the object
 * newObject: JSON object representing the updated info about the object
 * url: string, the url for the put request
 */
function updateById(objectId, newObject, url) {
	axios.put(url.concat(objectId), newObject)
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * delete one existing ingredient
 * objectId: string, the id of the object
 * url: string, the url for the delete request
 */
function deleteById(objectId, url) {
	axios.delete(url.concat(objectId))
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

//export functions above for use by other modules
export { create, getAll, getAllAsync, getById, getByIdAsync, updateById, deleteById};