import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import WelcomeImage from './box_of_veggie.jpg';
import * as cardConstants from  './constants.js';
import logo from '../NavigationBar/grain1.png';

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
      <FlatButton label= {cardConstants.ADD_INGREDIENTS} />
      <FlatButton label= {cardConstants.ADD_VENDORS}/>
    </CardActions>
  </Card>
);

export default WelcomeCard;
