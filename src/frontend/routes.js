import React from 'react';
import { Switch, Route } from 'react-router-dom'
//import App from './App';
import DashBoard from './components/dashboard/DashBoard';
import AdminIngredients from './components/admin/AdminIngredients';
import UserIngredients from './components/ingredients/UserIngredients';
import Inventory from './components/inventory/Inventory';
import Orders from './components/orders/Orders';
import Storage from './components/storage/Storage';
import Vendors from './components/vendors/Vendors';

const Routes = () => (
      <div>
	      <Switch>
		      <Route exact path="/" component={DashBoard} />
		      <Route path="/dashboard" component={DashBoard} />
		      <Route path="/admin-ingredients" component={AdminIngredients} />
		      <Route path="/user-ingredients" component={UserIngredients} />
		      <Route path="/inventory" component={Inventory} />
		      <Route path="/orders" component={Orders} />
		      <Route path="/storage" component={Storage} />
          <Route path="/vendors" component={Vendors} />
		  </Switch>
      </div>

);

export default Routes
