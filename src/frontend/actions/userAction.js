//userActions.js
import axios from 'axios';

/* create a user
 * user: JSON object
 * returns the reponse on successful completion
 */
function createUser(user) {
	axios.post('/users', user)
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};

/* 
 * get all users
 * 
 */
function getAllUsers() {
	axios.get('/users')
	.then(function (response) {
		console.log(response);
		return response;
	})
	.catch(function (error) {
		console.log(error);
	});
};