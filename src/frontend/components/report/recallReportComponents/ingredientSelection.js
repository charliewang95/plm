// ingredientSelection.js
// adopted from https://github.com/JedWatson/react-select/blob/master/examples/src/components/Contributors.js
import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
//ui stuff
import Select from 'react-select';
//local imports
import * as IngredientInterface from '../../../interface/ingredientInterface';

//globals
var sessionId = "";

const MAX_CONTRIBUTORS = 6;
const MAX_INGREDIENTS = 10;
const ASYNC_DELAY = 500;

export default class IngredientSelection extends React.PureComponent{
	constructor(props){
		super(props);
		//setting up initial states
		this.state = {
			multi: false,
			value: null,
			availableIngredientLabelValuePair: [],
			availableIngredients:[],
		}
		//binding functions
		this.onChange = this.onChange.bind(this);
		this.switchToMulti = this.switchToMulti.bind(this);
		this.switchToSingle = this.switchToSingle.bind(this);
		this.fetchAvailableIngredients = this.fetchAvailableIngredients.bind(this);
		this.getFilteredIngredients = this.getFilteredIngredients.bind(this);
		this.findIngredientInfo = this.findIngredientInfo.bind(this);
		//functions from props
		this.setIngredient = this.props.setIngredient;
	}

	findIngredientInfo(ingredientName){
		if (!this.availableIngredients) return -1;
		for (var i = 0; i < this.availableIngredients.length; i++) {
      		if (this.availableIngredients[i].name === ingredientName){
      			console.log("Found an ingredient with name " + ingredientName);
      			console.log(this.availableIngredients[i]);
      			return this.availableIngredients[i];
      		}
    	}
    	return -1;
	}

	onChange (value) {
		this.setState({
			value: value,
		});
		console.log("Value of ingredient selection changed to");
		console.log(value);
		if(value){
			const ingredientName = value.label;
			console.log("Ingredient name is extracted to be");
			console.log(ingredientName); 
			const ingredientInfo = this.findIngredientInfo(ingredientName);
			this.setIngredient(ingredientName, ingredientInfo);
		} else {
			this.setIngredient(null,null);
		}
		
	}

	switchToMulti () {
		this.setState({
			multi: true,
			value: [this.state.value],
		});
	}
	switchToSingle () {
		this.setState({
			multi: false,
			value: this.state.value[0],
		});
	}
	//dan methods
	fetchSessionId(){
		sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
		console.log("sessionId: " + sessionId);
  	}

  	async fetchAvailableIngredients(){
  		const response = await IngredientInterface.getAllIngredientsAsync(sessionId);
  		console.log("response:")
  		console.log(response);
  		const ingredients = response;
  		this.availableIngredients = ingredients;
  		console.log("ingredients")
  		console.log(ingredients);
  		console.log("this.state.availableIngredients:");
  		console.log(this.availableIngredients);
  		var intermediateData = [];

  		if(ingredients){
  			for (var i = 0; i < ingredients.length; i++) {
      			var singleData = new Object ();
      			singleData.label = ingredients[i].name;
      			intermediateData.push(singleData);
    		}
  		}

  		console.log("intermediateData:");
  		console.log(intermediateData);
    
    	this.availableIngredientLabelValuePair = intermediateData.map(ingredientName => ({
  			value: ingredientName.label.toLowerCase(),
  			label: ingredientName.label,
		}));

		console.log("availableIngredientLabelValuePair");
		console.log(this.availableIngredientLabelValuePair);
  	}

	async componentWillMount(){
		this.fetchSessionId();
		await this.fetchAvailableIngredients();
	}

	getFilteredIngredients (input, callback) {	
		if(!this.availableIngredientLabelValuePair) {
			console.log("availableIngredientLabelValuePair has not been loaded yet")
			var data = {
				options: [],
				complete: true,
			};
			setTimeout(function() {
				callback(null, data);
			}, ASYNC_DELAY);
			return;
		}
		input = input.toLowerCase();
		console.log("availableIngredientLabelValuePair:");
		console.log(this.availableIngredientLabelValuePair);
		var options = this.availableIngredientLabelValuePair.filter(i => {
			return i.value.substr(0, input.length) === input;
		});
		console.log("options");
		console.log(options);
		var data = {
			options: options.slice(0, MAX_INGREDIENTS),
			complete: options.length <= MAX_INGREDIENTS,
		};
		setTimeout(function() {
			callback(null, data);
		}, ASYNC_DELAY);
	}
	//
	render () {
		return (
			<div>
				{/*<h3 className="section-heading">{this.props.label}  <a href="https://github.com/JedWatson/react-select/tree/master/examples/src/components/Contributors.js">(Source)</a></h3>*/}
				<Select.Async 
					multi={this.state.multi} 
					value={this.state.value} 
					onChange={this.onChange} 
					// onValueClick={this.gotoContributor} 
					valueKey="value" 
					labelKey="label" 
					loadOptions={this.getFilteredIngredients} 
					noResultsText="No results found"
					placeholder="Type to search for an ingredient"
				/>
			</div>
		);
	}
}