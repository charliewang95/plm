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
import AddVendorForm from './components/vendors/AddVendorForm';
import Cart from './components/cart/Cart';
import Report from './components/report/Report';
import Login from './components/login/LoginPage';
import Register from './components/login/RegisterPage';

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
		      <Route path="/login" component={Login} />
		      <Route path="/register" component={Register} />
	          <Route path="/vendors" component={Vendors} />
	          <Route path="/addVendorForm" component={AddVendorForm} />
	          <Route path="/cart" component={Cart} />
	          <Route path="/report" component={Report} />
		  </Switch>
      </div>

);

export default Routes
