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
loggedIn: boolean 
**/
function packIntoJson(email, username, password, isAdmin, loggedIn){
	var userJson = new Object();
	userJson.email = email;
	userJson.username = username;
	userJson.password = password;
	userJson.isAdmin = isAdmin;
	userJson.loggedIn = loggedIn;
	console.log("JSON");
	console.log(userJson);
	//console.log(dummyUser.sampleUser);
	return userJson;
};

/* add one user
 * for arguments see packIntoJson
 * sessionId: string, id of the current session
 */
async function addUser(email, username, password, isAdmin, loggedIn, sessionId) {
	var newUser = packIntoJson(email, username, password, isAdmin, loggedIn);
	return await userActions.addUser(newUser, sessionId);
};

/**
 * get all users
 * sessionId: string, id of the current session
**/
async function getAllUsersAsync(sessionId) {
	return await userActions.getAllUsersAsync(sessionId);
};

/* 
 * get one user
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 */
async function getUserAsync(userId, sessionId) {
	return await userActions.getUserAsync(userId, sessionId);
};

/* 
 * update one user
 * userId: string, the id of the user
 * other arguments: see packIntoJson()
 * sessionId: string, id of the current session
 */
async function updateUser(userId, email, username, password, isAdmin, loggedIn, sessionId) {
	var updatedUser = packIntoJson(email, username, password, isAdmin, loggedIn);
	return await userActions.updateUser(userId, sessionId, updatedUser);
};

/* 
 * delete one existing user
 * userId: string, the id of the user
 * sessionId: string, id of the current session
 */
async function deleteUser(userId, sessionId) {
	return await userActions.deleteUser(userId, sessionId);
};

/*
 * function that checks if user could login with provided information
 * email: string, email of the user
 * password: string, password of the user
 */
async function authenticateAsync(username, password, callback){
	var userInfo = new Object();
	userInfo.username = username;
	userInfo.password = password;
//	try {
      	await userActions.authenticateAsync(userInfo, function(obj){
      	    callback(obj);
      	});
//    }
//    catch(e) {
//      console.log('there was an error');
//      console.log(e);
//      //TODO: different error message for different types of error
//      throw e;
//    }
}

//export functions above for use by other modules
export { addUser, getAllUsersAsync, getUserAsync, updateUser, deleteUser, authenticateAsync};