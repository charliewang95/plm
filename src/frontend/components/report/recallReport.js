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
			ingredientName: null,
			vendor: null,
			lotNumber: null
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
		const {ingredientName, vendor, lotNumber} = this.state;
		return (
			<Paper>
			<p> ingredient name is {ingredientName} </p>
			{ingredientName && <p> vendor is {vendor} </p>}
			{ingredientName && vendor && <p> lot number is {lotNumber} </p>}
			<IngredientSelection 
				selectedIngredientValue={ingredientName}
			/>
			</Paper>
		)
	}
}
