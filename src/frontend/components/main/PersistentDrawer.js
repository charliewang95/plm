import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
//import { MenuItem } from 'material-ui/Menu';
import Typography from 'material-ui/Typography';
//import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import { UserListItems, MainListItems } from './NavMenuList';
import Routes from '../../routes.js';
import Login from '../login/LoginPage';
import cookie from 'react-cookies';
import Button from 'material-ui/Button';
import {Link} from 'react-router-dom';
import ExitToApp from 'material-ui-icons/ExitToApp';
import {MenuList} from 'material-ui/Menu';
import MainList from './MainList'

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    width: '100%',
    flexGrow: 1,
  //  backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
    },
  },
  'content-left': {
    marginLeft: -drawerWidth,
  },
  'content-right': {
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'contentShift-left': {
    marginLeft: 0,
  },
  'contentShift-right': {
    marginRight: 0,
  },
  flex: {
    flex: 1,
  },
  icon:{
    marginRight: 5,
  }
});


class PersistentDrawer extends React.Component {

  constructor(props) {
        super(props);
        this.state = {
          open: false,
          anchor: 'left',
          loggedIn: (localStorage.getItem('user')!=null),
          isAdmin: ((localStorage.getItem('user')!=null)?(localStorage.getItem('user').isAdmin):false),
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
  }

  login(key, user){
    //alert(message.toString());
    //this.setState({loggedIn:key});
    //this.setState({user:JSON.stringify(user)});
    //this.setState({ user:user });
    //localStorage.getItem('user') = user;
    console.log("login");
    console.log(key);
    this.handleDrawerOpen();
    this.setState({isAdmin: key});
    this.setState({loggedIn: (localStorage.getItem('user')!=null)});

    //console.log(localStorage.getItem('user'));
  }

  componentDidMount(){
    console.log("component did mount");
    console.log(((localStorage.getItem('user')!=null)?(localStorage.getItem('user').isAdmin):false));
  }

  logout(){
    localStorage.removeItem('user');
    this.handleDrawerClose();
    this.setState({loggedIn: (localStorage.getItem('user')!=null)});
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
  };

  render() {
    console.log("isAdmin ", this.state.isAdmin);
    const { classes, theme } = this.props;
    const { anchor, open } = this.state;
    const drawer = (
      <Drawer
        type="persistent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor={anchor}
        open={open}
      >
        <div className={classes.drawerInner}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          {this.state.isAdmin && <List className={classes.list}>{UserListItems}</List> }
          <Divider />
          <MainList> </MainList>
        </div>
      </Drawer>
    );

    let before = null;
    let after = null;

    if (anchor === 'left') {
      before = drawer;
    } else {
      after = drawer;
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          {this.state.loggedIn && <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
            })}
          >
            <Toolbar disableGutters={!open}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" className={classes.flex} color="inherit" noWrap>
                Real Producer
              </Typography>
              <Button raised color="secondary" onClick={this.logout} component={Link} to="/"><ExitToApp className={classes.icon}/> Logout</Button>
            </Toolbar>
          </AppBar>}
          {before}
          <main
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >
            {this.state.loggedIn && <Routes/>}
            {!this.state.loggedIn && <Login login={this.login}/>}
          </main>
          {after}
        </div>
      </div>
    );
  }
}

PersistentDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawer);
