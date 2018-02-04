//userAction.js
import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/users';
const property = 'searchedUser';

/* add one user
 * user: JSON object
 * sessionId: string
 */
function addUser(user, sessionId) {
	return genericActions.create(baseUrl, user, sessionId);
};

/* 
 * get all users
 * deprecated, use getAllUsersAsync() instead
 */
 /*
function getAllUsers() {
	return genericActions.getAll(baseUrl);
};
*/

/* 
 * get all users
 * sessionId: string, id of the current session
 */
function getAllUsersAsync(sessionId){
	return genericActions.getAllAsync(baseUrl, sessionId);
};

/* 
 * get one user specified by an id
 * deprecatd, use getUserAsync() instead
 * userId: string, the id of the user
 */
 /*
function getUser(userId) {
	return genericActions.getById(userId, baseUrl.concat(property).concat('/') );
};
*/

/* 
 * get one user specified by an id
 * ingredientId: string, the id of the ingredient
 * sessionId: string, id of the current session
 */
function getUserAsync(userId, sessionId){
	return genericActions.getByIdAsync(baseUrl, property, userId, sessionId);
};


/* 
 * update one user information
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 * user: JSON object representing the updated info about the user
 */
function updateUser(userId, sessionId, user) {
	return genericActions.updateById(baseUrl, property, userId, sessionId, user);
};

/* 
 * delete one existing user
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 */
function deleteUser(userId, sessionId) {
	return genericActions.deleteById(baseUrl, property, userId, sessionId);
};

/*
 * function that checks if user could login with provided information
 * user: JSON object containing email and password
 */
async function authenticateAsync(user){
    var completeUrl = '/users/authenticate';
	try {
      	const res = await axios.post(completeUrl, user);
		const result = res.data;
		console.log("returning: " + result);
		return result;
    }
    catch(e) {
      console.log('there was an error');
      console.log(e); 
      //TODO: different error message for different types of error
      throw e;
    }
}

//export functions above for use by other modules
export { addUser, getAllUsersAsync, getUserAsync, updateUser, deleteUser, authenticateAsync};