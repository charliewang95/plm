import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar';
import Routes from './routes.js'
import * as ingredientActions from './actions/ingredientAction.js'
import * as dummyIngredient from './dummyDatas/ingredient.js'
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
  }

  toggleDrawer = () => this.setState({ open: !this.state.open })

  render() {
    return (
      // <div>
      //   <Route path="/" component={App} />
      //   <Route path="/home" component={Home} />
      //   <Route path="about" component={About} />
      // </div>
      <div>
        <AppBar
        //  title={<span><img src="https://www.svgrepo.com/show/21284/farm.svg" style={{marginTop: 10}} height="45" width = "45" />Real Producers</span>}
          title="Real Producers"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonClick ={this.toggleDrawer}
        />

        <Drawer
          docked={false}
          width={300}
          onRequestChange={this.toggleDrawer}
          open={this.state.open}
        >
          <AppBar title="Title" onLeftIconButtonClick ={this.toggleDrawer} />
          <MenuItem
            primaryText="home"
            containerElement={<Link to="/home" />}
            onClick={() => {
              console.log('going home')
              alert('going home!')
              this.toggleDrawer()
            }}
          />
          <MenuItem
            primaryText="about"
            containerElement={<Link to="/about" />}
            onClick={() => {
              console.log('about')
              alert('going to about page!')
              this.toggleDrawer()
            }}
          />
        </Drawer>

        <div style={{ textAlign: 'center' }}>
          {this.props.children}

          <RaisedButton
            label="Toggle Drawer"
            onClick={()=>ingredientActions.addIngredient("corn","drum","freezer",'WholeFoods, HarrisTeeter, Krogers')}
          />
        </div>

      </div>
    )
  }
}

export default App
