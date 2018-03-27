// ingredientSelection.js
// adopted from https://github.com/JedWatson/react-select/blob/master/examples/src/components/Contributors.js
import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
//ui stuff
import Select from 'react-select';
//local imports
import * as IngredientInterface from '../../interface/ingredientInterface';

// const CONTRIBUTORS = require('../data/contributors');
// const CONTRIBUTORS = [ //copied directly from the place
// 	{ github: 'jedwatson', name: 'Jed Watson' },
// 	{ github: 'bruderstein', name: 'Dave Brotherstone' },
// 	{ github: 'jossmac', name: 'Joss Mackison' },
// 	{ github: 'jniechcial', name: 'Jakub Niechciał' },
// 	{ github: 'craigdallimore', name: 'Craig Dallimore' },
// 	{ github: 'julen', name: 'Julen Ruiz Aizpuru' },
// 	{ github: 'dcousens', name: 'Daniel Cousens' },
// 	{ github: 'jgautsch', name: 'Jon Gautsch' },
// 	{ github: 'dmitry-smirnov', name: 'Dmitry Smirnov' },
// ];
//globals
var sessionId = "";

const MAX_CONTRIBUTORS = 6;
const MAX_INGREDIENTS = 10;
const ASYNC_DELAY = 500;

const Contributors = createClass({
	displayName: 'Contributors',
	propTypes: {
		label: PropTypes.string,
	},
	getInitialState () {
		return {
			multi: false,
			value: null,
			availableIngredients: [],
			selectedIngredient: this.props.
		};
	},
	onChange (value) {
		this.setState({
			value: value,
		});
	},
	switchToMulti () {
		this.setState({
			multi: true,
			value: [this.state.value],
		});
	},
	switchToSingle () {
		this.setState({
			multi: false,
			value: this.state.value[0],
		});
	},
	getContributors (input, callback) {
		input = input.toLowerCase();
		var options = CONTRIBUTORS.filter(i => {
			return i.github.substr(0, input.length) === input;
		});
		console.log("options");
		console.log(options);
		var data = {
			options: options.slice(0, MAX_CONTRIBUTORS),
			complete: options.length <= MAX_CONTRIBUTORS,
		};
		setTimeout(function() {
			callback(null, data);
		}, ASYNC_DELAY);
	},
	gotoContributor (value, event) {
		window.open('https://github.com/' + value.github);
	},
	//dan methods
	fetchSessionId(){
		sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
		console.log("sessionId: " + sessionId);
  	},

  	async fetchAvailableIngredients(){
  		const response = await IngredientInterface.getAllIngredientNamesAsync(sessionId);
  		console.log("response:")
  		console.log(response);
  		const ingredientNames = response.data;
  		console.log("ingredientNames")
  		console.log(ingredientNames);
  		var intermediateData = [];

  		if(ingredientNames){
  			for (var i = 0; i < ingredientNames.length; i++) {
      			var singleData = new Object ();
      			singleData.label = ingredientNames[i].ingredientName;
      			intermediateData.push(singleData);
    		}
  		}

  		console.log("intermediateData:");
  		console.log(intermediateData);
    
    	this.availableIngredients = intermediateData.map(ingredientName => ({
  			value: ingredientName.label.toLowerCase(),
  			label: ingredientName.label,
		}));

		console.log("availableIngredients");
		console.log(this.availableIngredients);
		console.log("CONTRIBUTORS"); //for comparison
		console.log(CONTRIBUTORS);
  	},

	async componentWillMount(){
		this.fetchSessionId();
		await this.fetchAvailableIngredients();
	},

	getFilteredIngredients (input, callback) {	
		if(!this.availableIngredients) {
			console.log("availableIngredients has not been loaded yet")
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
		console.log("availableIngredients:");
		console.log(this.availableIngredients);
		var options = this.availableIngredients.filter(i => {
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
	},
	//
	render () {
		return (
			<div className="section">
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

				{/*
				<Select.Async 
					multi={this.state.multi} 
					value={this.state.value} 
					onChange={this.onChange} 
					onValueClick={this.gotoContributor} 
					valueKey="github" 
					labelKey="name" 
					loadOptions={this.getContributors} 
				/>
				*/}
				{/*
				<div className="checkbox-list">
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={this.state.multi} onChange={this.switchToMulti}/>
						<span className="checkbox-label">Multiselect</span>
					</label>
					<label className="checkbox">
						<input type="radio" className="checkbox-control" checked={!this.state.multi} onChange={this.switchToSingle}/>
						<span className="checkbox-label">Single Value</span>
					</label>
				</div>
				*/}
				{/*<div className="hint">This example implements custom label and value properties, async options and opens the github profiles in a new window when values are clicked</div>*/}
			</div>
		);
	}
});

export default Contributors;