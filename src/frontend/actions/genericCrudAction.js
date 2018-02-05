//CrudActions.js
//defines CRUD functions that are common to database operations
import axios from 'axios';
/*****************
helper functions
*********************/

/**
 * appends session Id info to the end of url to accomodate changes made in routing
 * url: string, base url
 * sessionId: string, the id of the current session stored in the front end
**/
function appendSessionIdToUrl(url, sessionId){
	const userString = 'user';
	return appendSegmentsToUrl(url, [userString, sessionId]);
};

/**
 * Appends additional segment to the original url
 * Every url that is passed as argument should not end with /
 * originalUrl: string, where the text will be appended to, does not end with '/'
 * additionalSegments: array of string, what is to be appended at the end of the origianl url
 * returns originalText + '/' + (addtionalSegments seperated by '/')
 */
function appendSegmentsToUrl(originalUrl, additionalSegments){
	var intermediateUrl = originalUrl;
	additionalSegments.forEach(function(segment){
		intermediateUrl = intermediateUrl.concat('/').concat(segment);
	});
	const completeUrl = intermediateUrl;
	return completeUrl;
};

/*************************
exported methods
*************************/

//All the methods below return the response on successful completion

/* create a new entry in the database
 * url: string, the url for the post request
 * object: JSON object
 * sessionId: string, id of the current session
 */
async function create(url, object, sessionId) {
	console.log('generic creating...')
	var completeUrl = appendSessionIdToUrl(url,sessionId);
	try {
      	const res = await axios.post(completeUrl, object);
		const result = res.data;
		console.log(result);
		return result;
    }
    catch(e) {
      console.log('there was an error');
      console.log(e); 
      //TODO: different error message for different types of error
      throw e;
    }
	
	/*
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});*/
};

/* 
 * get all objects of a kind
 * url: string, the url for the get request
 */
 /*
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
*/

/* 
 * get all objects of a kind
 * url: string, the url for the get request
 * sessionId: string, id of the current session
 */
async function getAllAsync(url, sessionId) {
	var completeUrl = appendSessionIdToUrl(url,sessionId);
	console.log("generic CRUD: getAllAsync()");
	console.log("url: " + completeUrl);
	console.log("sessionId: " + sessionId);

	const res = await axios.get(completeUrl);
	const result = res.data;
	console.log("returning: " + result);
	return result;
}

/* 
 * get one object with a specfic id
 * deprecated, use getByIdAsync instead
 * objectId: string, the id of the ingredient
 * url: string, the url for the get request
 */
 /*
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
*/

/* 
 * get one object with a specfic id
 * url: string, the base url for the get request
 * propertyName: string, segment in front of the objectId in the complete url used to identify what 
 * the next segment is
 * objectId: string, the id of the object as returned from the database
 * sessionId: string, id of the current session
 */
async function getByIdAsync(url, propertyName, objectId, sessionId) {
	const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName, objectId]);
	const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);
	console.log("generic CRUD: getByIdAsync()");
	console.log("url: " + completeUrl);
	console.log("sessionId: " + sessionId);

	const res = await axios.get(completeUrl);
	const result = res.data;
	console.log("returning: " + result);
	return result;
};

/* 
 * update one existing object by Id
 * url: string, the url for the put request
 * propertyName: string, segment in front of the objectId in the complete url used to identify what 
 * the next segment is
 * objectId: string, the id of the object
 * sessionId: string, id of the current session
 * newObject: JSON object representing the updated info about the object
 */
function updateById(url, propertyName, objectId, sessionId, newObject) {
	const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName, objectId]);
	const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);
	axios.put(completeUrl, newObject)
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * delete one existing objct by id
 * url: string, the url for the delete request
 * propertyName: string, segment in front of the objectId in the complete url used to identify what 
 * the next segment is
 * objectId: string, the id of the object
 * sessionId: string, id of the current session
 */
function deleteById(url, propertyName, objectId, sessionId) {
	const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName, objectId]);
	const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);
	axios.delete(completeUrl)
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * delete all existing objects at a certain url
 * url: string, the url for the delete request
 * propertyName: string, segment following the base url
 * sessionId: string, id of the current session
 */
function deleteAll(url, propertyName, sessionId) {
	const urlWithoutSessionId = appendSegmentsToUrl(url, [propertyName]);
	const completeUrl = appendSessionIdToUrl(urlWithoutSessionId, sessionId);
	axios.delete(completeUrl)
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

//export functions above for use by other modules
export { create, getAllAsync, getByIdAsync, updateById, deleteById, deleteAll};