import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import {Link} from 'react-router-dom';
import DashboardIcon from 'material-ui-icons/Dashboard'; //Dashboard
import AndroidIcon from 'material-ui-icons/Android'; //Admin
import AttachMoneyIcon from 'material-ui-icons/AttachMoney'; //Orders
import KitchenIcon from 'material-ui-icons/Kitchen'; //Storage
import ShoppingCartIcon from 'material-ui-icons/ShoppingCart'; //Inventory
import LocalPizzaIcon from 'material-ui-icons/LocalPizza'; //Ingredients
import VendorsIcon from 'material-ui-icons/Group'; // Vendors

export const UserListItems = (
  <div>
    <ListItem component={Link} to="/dashboard" button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

    <ListItem component={Link} to="/admin-ingredients" button>
      <ListItemIcon>
        <AndroidIcon />
      </ListItemIcon>
      <ListItemText primary="Ingredients (Admin)" />
    </ListItem>
  </div>
);

export const MainListItems = (
  <div>
    <ListItem component={Link} to="/user-ingredients" button>
      <ListItemIcon>
        <LocalPizzaIcon/>
      </ListItemIcon>
      <ListItemText primary="Ingredients (User)" />
    </ListItem>
    <ListItem component={Link} to="/orders" button>
      <ListItemIcon>
        <AttachMoneyIcon />
      </ListItemIcon>
      <ListItemText primary="Orders" />
    </ListItem>
    <ListItem component={Link} to="/inventory" button>
      <ListItemIcon>
        <ShoppingCartIcon/>
      </ListItemIcon>
      <ListItemText primary="Inventory" />
    </ListItem>
    <ListItem component={Link} to="/storage" button>
      <ListItemIcon>
        <KitchenIcon />
      </ListItemIcon>
      <ListItemText primary="Storage" />
    </ListItem>
    <ListItem component={Link} to="/vendors" button>
      <ListItemIcon>
        <VendorsIcon />
      </ListItemIcon>
      <ListItemText primary="Vendors" />
    </ListItem>
  </div>
);
