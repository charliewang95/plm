
import React from 'react';
// import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NavigationBar from '../home/NavigationBar/NavigationBar';
import WelcomeCard from '../home/Welcome/Welcome';
import MaterialUiForm from '../Ingredients/index';

const App = () => (
  <MuiThemeProvider>
    <NavigationBar />
    <WelcomeCard />
    {/* < MaterialUiForm /> */}
  </MuiThemeProvider>
);

export default App;
