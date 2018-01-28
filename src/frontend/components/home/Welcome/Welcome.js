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
      <FlatButton label="Get One Ingredient" onClick={()=>ingredientActions.getIngredient("5a6bc27327f9a32508ebfe8b")} />
      <FlatButton label="Update Ingredient" onClick={()=>ingredientActions.updateIngredient("5a6bc27327f9a32508ebfe8b", dummyIngredient.updatedIngredient)} />
      <FlatButton label="Delete Ingredient" onClick={()=>ingredientActions.deleteIngredient("5a6bc27327f9a32508ebfe8b")} />
    </CardActions>
  </Card>
);

export default WelcomeCard;
