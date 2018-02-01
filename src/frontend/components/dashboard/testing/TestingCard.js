import React, {Component} from 'react';
import Card, {CardActions, CardHeader, CardMedia} from 'material-ui/Card';
import Button from 'material-ui/Button';
//import WelcomeImage from './box_of_veggie.jpg';
//import Typography from 'material-ui/Typography';
import * as cardConstants from  './constants.js';
//axios actions
import * as ingredientActions from '../../../actions/ingredientAction'
import * as userActions from '../../../actions/userAction'
import * as vendorActions from '../../../actions/vendorAction'
//dummy data for testing
import * as dummyIngredient from '../../../dummyDatas/ingredient'
import * as dummyUser from '../../../dummyDatas/user'
import * as dummyVendor from '../../../dummyDatas/vendor'
//for testing purposes only, hard coded Id from looking in the database
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
//import classnames from 'classnames';
const ingredientId = '5a6e2b65d141d5472554fc51';
const userId = '5a6e2f9b1c2c30482e142ddf';
const vendorId = '5a6e333f0c569f48f7d22242';
//

const styles = theme => ({
  card: {
    maxWidth: 1600,
  },
  media: {
    height: 1000,
  },
});



class TestingCard extends Component {

  render() {
     const { classes } = this.props;
        
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader title={cardConstants.WELCOME_MESSAGE}/>
          <CardMedia className={classes.media} image="/box_of_veggie.jpg"/> 
          <CardActions >
            <Button onClick={()=>ingredientActions.addIngredient(dummyIngredient.sampleIngredient)}>
                {cardConstants.ADD_INGREDIENTS}
            </Button>

            <Button onClick={()=>userActions.addUser(dummyUser.sampleUser)}>
                Add User
            </Button>

            <Button onClick={()=>vendorActions.addVendor(dummyVendor.sampleVendor)}>
              {cardConstants.ADD_VENDORS}
            </Button>

            <Button onClick={()=>vendorActions.getAllVendors()}>
              All vendors
            </Button>

            <Button onClick={()=>vendorActions.getVendor(vendorId)}>
              Get One Vendor
            </Button>

            <Button onClick={()=>vendorActions.updateVendor(vendorId, dummyVendor.updatedVendor)}>
              Update Vendor
            </Button>

            <Button onClick={()=>vendorActions.deleteVendor(vendorId)}>
              Delete Vendor
            </Button>

            <Button onClick={()=>alert("Button pressed!")}>
              Alert
            </Button>

            <Button onClick={()=>ingredientActions.getAllIngredients()}>
              All ingredients
            </Button>

            <Button onClick={()=>ingredientActions.getIngredient(ingredientId)}>
              Get One Ingredient
            </Button>
            <Button onClick={()=>ingredientActions.updateIngredient(ingredientId, dummyIngredient.updatedIngredient)}>
              Update Ingredient
            </Button>

            <Button onClick={()=>ingredientActions.deleteIngredient(ingredientId)}>
              Delete Ingredient    
            </Button>

            <Button onClick={()=>userActions.getAllUsers()}>
              All Users
            </Button>

            <Button onClick={()=>userActions.getUser(userId)}>
              Get One User
            </Button>

            <Button onClick={()=>userActions.updateUser(userId, dummyUser.updatedUser)}>
              Update User
            </Button>

            <Button onClick={()=>userActions.deleteUser(userId)}>
              Delete User
            </Button>

          </CardActions>
        </Card>
      </div>
    );
  }
}

TestingCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TestingCard);


