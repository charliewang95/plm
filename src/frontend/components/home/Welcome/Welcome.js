import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import WelcomeImage from './box_of_veggie.jpg';
import * as cardConstants from  './constants.js';
import logo from '../NavigationBar/grain1.png';
//axios interface
import * as ingredientInterface from '../../../interface/ingredientInterface'
import * as userInterface from '../../../interface/userInterface'
import * as vendorInterface from '../../../interface/vendorInterface'
//dummy data for testing
import * as dummyIngredient from '../../../dummyDatas/ingredient'
import * as dummyUser from '../../../dummyDatas/user'
import * as dummyVendor from '../../../dummyDatas/vendor'
//for testing purposes only, hard coded Id from looking in the database
const ingredientId = '5a6e2b65d141d5472554fc51';
const userId = '5a6e2f9b1c2c30482e142ddf';
const vendorId = '5a6e333f0c569f48f7d22242';
//
const WelcomeCard = () => (
  <Card>
    <CardHeader
      // title={cardConstants.CARD_HEADER}
      // avatar={logo}
    />
    <CardMedia
      overlay={<CardTitle title= {cardConstants.WELCOME_MESSAGE} />}
    >
      <img src={WelcomeImage}/>
    </CardMedia>

    <CardActions>
      <FlatButton label={cardConstants.ADD_INGREDIENTS} onClick={()=>ingredientInterface.addIngredient(
        dummyIngredient.sampleIngredient.name, dummyIngredient.sampleIngredient.package, 
        dummyIngredient.sampleIngredient.temperatureZone, dummyIngredient.sampleIngredient.vendors)} />
      <FlatButton label="Add User" onClick={()=>userInterface.addUser(
        dummyUser.sampleUser.email, dummyUser.sampleUser.username,
        dummyUser.sampleUser.password, dummyUser.sampleUser.isAdmin
        )} />
      <FlatButton label={cardConstants.ADD_VENDORS} onClick={()=>vendorInterface.addVendor(
        dummyVendor.sampleVendor.name, dummyVendor.sampleVendor.contact,
        dummyVendor.sampleVendor.code, null)} />

      <FlatButton label="All vendors" onClick={()=>vendorInterface.getAllVendorsAsync()} />
      <FlatButton label="Get One Vendor" onClick={()=>vendorInterface.getVendorAsync(vendorId)} />
      <FlatButton label="Update Vendor" onClick={()=>vendorInterface.updateVendor(vendorId, dummyVendor.updatedVendor)} />
      <FlatButton label="Delete Vendor" onClick={()=>vendorInterface.deleteVendor(vendorId)} />

      <FlatButton label="Alert" onClick={()=>alert("Button pressed!")} />

      <FlatButton label="All ingredients" onClick={()=>ingredientInterface.getAllIngredientsAsync()} />
      <FlatButton label="Get One Ingredient" onClick={()=>ingredientInterface.getIngredientAsync(ingredientId)} />
      <FlatButton label="Update Ingredient" onClick={()=>ingredientInterface.updateIngredient(ingredientId, dummyIngredient.updatedIngredient)} />
      <FlatButton label="Delete Ingredient" onClick={()=>ingredientInterface.deleteIngredient(ingredientId)} />

      <FlatButton label="All Users" onClick={()=>userInterface.getAllUsersAsync()} />
      <FlatButton label="Get One User" onClick={()=>userInterface.getUserAsync(userId)} />
      <FlatButton label="Update User" onClick={()=>userInterface.updateUser(userId, dummyUser.updatedUser)} />
      <FlatButton label="Delete User" onClick={()=>userInterface.deleteUser(userId)} />

    </CardActions>
  </Card>
);

export default WelcomeCard;
