//userAction.js
//import axios from 'axios';
import * as genericActions from './genericCrudAction'
//All the methods return the response on successful completion

const baseUrl = '/users';
const property = '/user';

/* add one user
 * user: JSON object
 */
function addUser(user) {
	return genericActions.create(user,baseUrl);
};

/* 
 * get all users
 * deprecated, use getAllUsersAsync() instead
 */
function getAllUsers() {
	return genericActions.getAll(baseUrl);
};

/* 
 * get all users
 * 
 */
function getAllUsersAsync(){
	return genericActions.getAllAsync(baseUrl);
};

/* 
 * get one user specified by an id
 * deprecatd, use getUserAsync() instead
 * userId: string, the id of the user
 */
function getUser(userId) {
	return genericActions.getById(userId, baseUrl.concat(property).concat('/') );
};

/* 
 * get one user specified by an id
 * ingredientId: string, the id of the ingredient
 */
function getUserAsync(userId){
	return genericActions.getByIdAsync(userId, baseUrl.concat(property).concat('/'));
};


/* 
 * update one user information
 * userId: string, the id of the user
 * user: JSON object representing the updated info about the user
 */
function updateUser(userId, user) {
	return genericActions.updateById(userId, user, baseUrl.concat(property).concat('/') );
};

/* 
 * delete one existing user
 * userId: string, the id of the user
 */
function deleteUser(userId) {
	return genericActions.deleteById(userId, baseUrl.concat(property).concat('/') );
};

//export functions above for use by other modules
export { addUser, getAllUsers, getAllUsersAsync, getUser, getUserAsync, updateUser, deleteUser};