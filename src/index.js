import React from 'react'
import ReactDOM from 'react-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import registerServiceWorker from './registerServiceWorker';
import App from './frontend/App'
import Routes from './frontend/routes'
import './index.css'



ReactDOM.render(
	<Routes >
  	</Routes>,
  document.getElementById('root')
)

registerServiceWorker()