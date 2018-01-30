import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import Routes from './routes.js'
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
          title="Title"
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
            onClick={this.toggleDrawer}
          />
        </div>

      </div>
    )
  }
}

export default App
