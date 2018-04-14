import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import {Link} from 'react-router-dom';
import DashboardIcon from 'material-ui-icons/Dashboard'; //Dashboard
import AndroidIcon from 'material-ui-icons/Android'; //Admin
import AttachMoneyIcon from 'material-ui-icons/AttachMoney'; //Orders
import KitchenIcon from 'material-ui-icons/Kitchen'; //Storage
import InventoryIcon from 'material-ui-icons/Assignment';//Inventory
import LocalPizzaIcon from 'material-ui-icons/LocalPizza'; //Ingredients
import VendorsIcon from 'material-ui-icons/Group'; // Vendors
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart'; // Cart
import ReportIcon from 'material-ui-icons/Receipt'; // Report
import BugReportIcon from 'material-ui-icons/BugReport'; // Report
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import PropTypes from 'prop-types';
import { MenuList, MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

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

export const UserListItems = (
  <div>
    {/*<ListItem component={Link} to="/register" button>
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Create User (Admin)" />
    </ListItem>*/}

     <ListItem component={Link} to="/admin-users" button>
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>
  </div>
);


//deprecated, moved to MainList.js
export const MainListItems = (
  <div>
    {/* <ListItem component={Link} to="/user-ingredients" button>
      <ListItemIcon>
        <LocalPizzaIcon/>
      </ListItemIcon>
      <ListItemText primary="Ingredients (User)" />
    </ListItem> */}
    <ListItem component={Link} to="/dashboard" button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem component={Link} to="/vendors" button>
        <ListItemIcon>
          <VendorsIcon />
        </ListItemIcon>
        <ListItemText primary="Vendors" />
      </ListItem>
    <ListItem component={Link} to="/admin-ingredients" button>
      <ListItemIcon>
        <LocalPizzaIcon />
      </ListItemIcon>
      <ListItemText primary="Ingredients" />
    </ListItem>
    {/* <ListItem component={Link} to="/orders" button>
      <ListItemIcon>
        <AttachMoneyIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem> */}
    <ListItem component={Link} to="/storage" button>
      <ListItemIcon>
        <KitchenIcon />
      </ListItemIcon>
      <ListItemText primary="Storage" />
    </ListItem>
    <ListItem component={Link} to="/formula" button>
      <ListItemIcon>
        <VendorsIcon />
      </ListItemIcon>
      <ListItemText primary="Formulas" />
    </ListItem>
    <ListItem component={Link} to="/cart" button>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Cart and Orders" />
    </ListItem>
    <ListItem component={Link} to="/report" button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Financial Report" />
    </ListItem>
    <ListItem component={Link} to="/log" button>
      <ListItemIcon>
        <BugReportIcon />
      </ListItemIcon>
      <ListItemText primary="Logs" />
    </ListItem>
  </div>
);

