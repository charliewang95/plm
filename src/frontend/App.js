import React, { Component } from 'react';
import PersistentDrawer from './components/main/PersistentDrawer.js'
import Routes from './routes.js';
import {Route, Switch} from 'react-router-dom'
import Login from './components/login/LoginPage';
import Notification from './components/main/Notification.js'
class App extends Component {

  // constructor(props) {
  //   super(props)
  // }
  render() {

    return (
    <div>
      <PersistentDrawer/>
      <Notification/>
    </div>
    )
  }
}

export default App
