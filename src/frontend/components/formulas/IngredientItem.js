import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'react-select';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import RemoveCircleIcon from 'material-ui-icons/RemoveCircle';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Delete from 'material-ui-icons/Delete';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

class IngredientItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
    };
  }

  componentDidMount(){
    console.log("I am in ingredientitem");
    console.log(this.props.ingredientsArray);
  }

  render() {
     const { classes } = this.props;
    return (
    	<div>
      {this.props.ingredientsArray && this.props.ingredientsArray.map((ingredient,index)=>(
          // <IconButton aria-label="Delete" onClick={()=>{this.props.deleteIngredient(index);}}>
          // {ingredient.ingredientName} : {ingredient.price}
          // <RemoveCircleIcon />
          // </IconButton>
          <Button onClick={()=>{this.props.deleteIngredient(index, ingredient.ingredientName);}} variant="raised" color="primary">
        {ingredient.ingredientName} : {ingredient.quantity}
        <Delete/>
      </Button>

      ))}
      </div>
    );
  }
}

IngredientItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default IngredientItem
