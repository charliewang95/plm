//userInterface.js
//This interface is to be used by the front-end 
//It accepts string input as texts that follows the data-base schema
//creates the corresponding json object if necessary
//and calls actions to send the actual requests
import * as dummyUser from '../dummyDatas/user.js'
import * as userActions from '../actions/userAction'

/**
takes in various properties of user,
returns a Json object that encapsulates all properties 
name: string
username: string 
password: string
isAdmin: boolean
**/
function packIntoJson(email, username, password, isAdmin){
	var userJson = new Object();
	userJson.email = email;
	userJson.username = username;
	userJson.password = password;
	userJson.isAdmin = isAdmin;
	console.log("JSON");
	console.log(userJson);
	console.log(dummyUser.sampleUser);
	return userJson;
};

/* add one user
 * for arguments see packIntoJson
 */
function addUser(email, username, password, isAdmin) {
	var newUser = packIntoJson(email, username, password, isAdmin);
	userActions.addUser(newUser);
};

/**
 * get all users
**/
function getAllUsersAsync() {
	return userActions.getAllUsersAsync();
};

/* 
 * get one user
 * userId: string, the id of the user
 */
function getUserAsync(userId) {
	return userActions.getUserAsync(userId);
};

/* 
 * update one user
 * userId: string, the id of the user
 * other arguments: see packIntoJson()
 */
function updateUser(userId, email, username, password, isAdmin) {
	var updatedUser = packIntoJson(email, username, password, isAdmin);
	return userActions.updateUser(userId, updatedUser);
};

/* 
 * delete one existing user
 * userId: string, the id of the user
 */
function deleteUser(userId) {
	return userActions.deleteUser(userId);
};

//export functions above for use by other modules
export { addUser, getAllUsersAsync, getUserAsync, updateUser, deleteUser};