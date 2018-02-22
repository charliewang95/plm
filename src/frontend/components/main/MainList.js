// MainList.js
import React from 'react';
import PropTypes from 'prop-types';
import { MenuList, MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import {Link} from 'react-router-dom';
import DashboardIcon from 'material-ui-icons/Dashboard'; //Dashboard
import KitchenIcon from 'material-ui-icons/Kitchen'; //Storage
import InventoryIcon from 'material-ui-icons/Assignment';//Inventory
import LocalPizzaIcon from 'material-ui-icons/LocalPizza'; //Ingredients
import VendorsIcon from 'material-ui-icons/Group'; // Vendors
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart'; // Cart

const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
});

function ListItemComposition(props) {
  const { classes } = props;

  return (
    <div>
      <MenuList>

        <MenuItem className={classes.menuItem} component={Link} to="/dashboard" button>
          <ListItemIcon className={classes.icon}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Dashboard" />
        </MenuItem>

        <MenuItem className={classes.menuItem} component={Link} to="/admin-ingredients" button>
          <ListItemIcon className={classes.icon}>
            <LocalPizzaIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Ingredients" />
        </MenuItem>

        <MenuItem className={classes.menuItem} component={Link} to="/inventory" button>
          <ListItemIcon className={classes.icon}>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Inventory" />
        </MenuItem>

        <MenuItem className={classes.menuItem} component={Link} to="/storage" button>
          <ListItemIcon className={classes.icon}>
            <KitchenIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Storage" />
        </MenuItem>

        <MenuItem className={classes.menuItem} component={Link} to="/vendors" button>
          <ListItemIcon className={classes.icon}>
            <VendorsIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Vendors" />
        </MenuItem>

        <MenuItem className={classes.menuItem} component={Link} to="/cart" button>
          <ListItemIcon className={classes.icon}>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Cart" />
        </MenuItem>

        <MenuItem className={classes.menuItem} component={Link} to="/report" button>
          <ListItemIcon className={classes.icon}>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText classes={{ primary: classes.primary }} inset primary="Financial Report" />
        </MenuItem>

      </MenuList>




    </div>
  );
}

ListItemComposition.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListItemComposition);
