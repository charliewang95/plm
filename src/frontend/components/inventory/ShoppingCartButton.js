import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart';
import Tooltip from 'material-ui/Tooltip';
import {Link} from 'react-router-dom';

let iconStyles = {
  fontSize: '48px'
};

const ShoppingCartButton=({ onExecute })=>{
  return(
    <Tooltip title="Add to Cart">
      {/* <Link to = "/addVendorForm"> */}
        <Button fab mini color="secondary" size="small" onClick={onExecute}>
          <ShoppingCartIcon style={iconStyles}/>
        </Button>
      {/* </Link> */}
    </Tooltip>
  );
}
ShoppingCartButton.propTypes = {
  onExecute: PropTypes.func.isRequired,
};

export default ShoppingCartButton;
