// recallReport.js
import React from 'react';
import Paper from 'material-ui/Paper';

//local import
import IngredientSelection from './recallReportComponents/ingredientSelection.js'
import VendorSelection from './recallReportComponents/vendorSelection.js'
import * as IngredientInterface from '../../interface/ingredientInterface';
// import * as IngredientLotInterface from '../../interface/ingredientLotInterface';
//
var sessionId = "";

//
export default class RecallReport extends React.PureComponent{
	constructor(props){
		super(props); //required
		this.state = {
			ingredientName: null,
			ingredientInfo: undefined,
			selectedVendor: null,
			vendorLabelValuePairs: [],
			lotNumber: null
		}
		//bind functions
		this.setIngredient = this.setIngredient.bind(this);
		this.getVendorLabelValuePairs = this.getVendorLabelValuePairs.bind(this);
		this.setVendor = this.setVendor.bind(this);
		this.getLotInfo = this.getLotInfo.bind(this);

	}
	fetchSessionId(){
		sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
		console.log("sessionId: " + sessionId);
	}

	componentDidMount(){
		this.fetchSessionId();
	}	

	setIngredient(name, info){
		if(name === this.state.ingredientName) return;//do nothing if it has not been changed
		const vendorLabelValuePairs = this.getVendorLabelValuePairs(info);
		console.log("vendorLabelValuePairs");
		console.log(vendorLabelValuePairs);
		this.setState({
			ingredientName: name,
			ingredientInfo: info,
			selectedVendor: null,
			vendorLabelValuePairs: vendorLabelValuePairs,
			lotNumber: null
		});
	}
	async getLotInfo(){
		console.log(this.state.ingredientInfo);
		const ingredientId = this.state.ingredientInfo._id;
		const response = await IngredientInterface.getAllLotNumbersAsync(ingredientId, sessionId);
		console.log('response');
		console.log(response);
		const arrayOfLots = response.data;
		console.log("arrayOfLots");
		console.log(arrayOfLots);
	}
	setVendor(vendorName){
		if(vendorName === this.state.selectedVendor) return; //do nothing if it has not been changed
		//get lot information from backend
		this.getLotInfo();
		this.setState({
			selectedVendor: vendorName,
			lotNumber: null
		})
	}

	getVendorLabelValuePairs(ingredientInfo){
		console.log("Entered getVendorLabelValuePairs");
		console.log("ingredientInfo");
		console.log(ingredientInfo);
		if(!ingredientInfo) return;
		const vendors = ingredientInfo.vendors;
		console.log("vendors of the selected ingredient");
		console.log(vendors);
		var intermediateData = [];
		if (vendors){
			for(var i = 0; i < vendors.length; i++){
				intermediateData.push(vendors[i].vendorName);
			}
		}
		console.log("intermediateData");
		console.log(intermediateData);
		var vendorLabelPairs = intermediateData.map(vendorName => ({
			value: vendorName,
			label: vendorName
		}));
		console.log("vendorLabelPairs");
		console.log(vendorLabelPairs);
		return vendorLabelPairs;

	}

	render() {
		const {ingredientName, ingredientInfo, selectedVendor, lotNumber,
			vendorLabelValuePairs} = this.state;
		return (
			<Paper>
			<p> ingredient name is {ingredientName}</p>
			{ingredientInfo && <p> ingredient id is {ingredientInfo._id} </p>}
			{ingredientName && <p> selectedVendor is {selectedVendor} </p>}
			{ingredientName && selectedVendor && <p> lot number is {lotNumber} </p>}
			<IngredientSelection 
				setIngredient={this.setIngredient}
			/>
			{
				ingredientName && 
				<VendorSelection
					vendorLabelValuePairs={vendorLabelValuePairs}
					setVendor={this.setVendor}
				/>
			}
			</Paper>
		)
	}
}
