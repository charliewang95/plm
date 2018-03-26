// recallReport.js
import React from 'react';
import Paper from 'material-ui/Paper';

//local import
import IngredientSelection from '../../utils/gadgets/ingredientSelection.js'
//
var sessionId = "";

//
export default class RecallReport extends React.PureComponent{
	constructor(props){
		super(props); //required
		this.state = {

		}
	}
	fetchSessionId(){
		sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
		console.log("sessionId: " + sessionId);
	}

	componentDidMount(){
		this.fetchSessionId();
	}	

	render() {
		return (
			<Paper>
			<IngredientSelection />
			</Paper>
		)
	}
}
