import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart';
import Tooltip from 'material-ui/Tooltip';
import {Link} from 'react-router-dom';

const ShoppingCartButton=()=>{
  return(
    <Tooltip title="Add Vendor">
      <Link to = "/addVendorForm">
        <Button fab color="secondary">
          <ShoppingCartIcon />
        </Button>
      </Link>
    </Tooltip>
  );
}

export default ShoppingCartButton;
