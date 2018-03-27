// vendorSelection.js

import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

export default class VendorSelection extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {
			//for select
			searchable: false,
			clearable: true,
			rtl: false,
			value: null,
			//
			vendors: props.vendorLabelValuePairs,

		}
		//binding functions
		this.updateValue = this.updateValue.bind(this);
		this.setVendor = props.setVendor;
	}
	updateValue (newValue) {
		this.setState({
			value: newValue,
		});
		console.log(newValue);
		this.setVendor(newValue);
	}

	componentDidMount(){
		console.log("vendors:");
		console.log(this.state.vendors);
	}

	render() {
		const {vendors} = this.state;

		return (
			<div>
			{/*<p> This is vendor selection </p>*/}
			<Select
				options={vendors}
				simpleValue
				clearable={this.state.clearable}
				name="selected-state"
				value={this.state.value}
				onChange={this.updateValue}
				rtl={this.state.rtl}
				searchable={this.state.searchable}
				placeholder="Select Vendor..."
			/>


			{/*<p> Here ends vendor selection </p>*/}
			</div>
		)
	}

}