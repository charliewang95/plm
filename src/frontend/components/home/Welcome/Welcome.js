import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import WelcomeImage from './box_of_veggie.jpg';
import * as cardConstants from  './constants.js';
import logo from '../NavigationBar/grain1.png';
//axios actions
import * as ingredientActions from '../../../actions/ingredientAction'
//dummy data for testing
import * as dummyIngredient from '../../../dummyDatas/ingredient'

const ingredientId = '5a6e2b65d141d5472554fc51'
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
      <FlatButton label={cardConstants.ADD_INGREDIENTS} onClick={()=>ingredientActions.addIngredient(dummyIngredient.sampleIngredient)} />
      
      <FlatButton label={cardConstants.ADD_VENDORS}/>
      
      <FlatButton label="Alert" onClick={()=>alert("Button pressed!")} />

      <FlatButton label="All ingredients" onClick={()=>ingredientActions.getAllIngredients()} />
      <FlatButton label="Get One Ingredient" onClick={()=>ingredientActions.getIngredient(ingredientId)} />
      <FlatButton label="Update Ingredient" onClick={()=>ingredientActions.updateIngredient(ingredientId, dummyIngredient.updatedIngredient)} />
      <FlatButton label="Delete Ingredient" onClick={()=>ingredientActions.deleteIngredient(ingredientId)} />
    </CardActions>
  </Card>
);

export default WelcomeCard;
