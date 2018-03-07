// backupTestPage.js
//front end
import React from 'react';
import Paper from 'material-ui/Paper';
//communicate to back end
import axios from 'axios';

class backupTestPage extends React.Component{

	async testBackup(){
		console.log("Entered testBackup()");
		const getUrl = "./test/backup" ;
		//do something useful
		await axios.get(getUrl);
		console.log("Exiting testBackup()");
	}

	render(){
		return (
			<Paper>
				<button onClick={this.testBackup}>
				Test Backup!
				</button>
			</Paper>
		)
	}
}

export default backupTestPage;