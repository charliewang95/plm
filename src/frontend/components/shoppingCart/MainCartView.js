import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import ShoppingCart from './shoppingCart.js';
import PendingOrderTable from './pendingOrder/PendingOrderTable.js';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    backgroundColor: theme.palette.background.paper,
  },
});

const pendingOrderKey = 'goToPendingOrders';

class MainCartView extends React.Component {

  constructor(props) {
    super(props);
    const defaultTab = sessionStorage.getItem(pendingOrderKey)? 1: 0;
    console.log('defaultTab is ' + defaultTab);
    this.state = {
      value: defaultTab,
    };

    sessionStorage.removeItem(pendingOrderKey);
    console.log(pendingOrderKey + " is removed from sessionStorage");
    console.log(sessionStorage.getItem(pendingOrderKey));

    this.changeToPending = value => {
      console.log("current value");
      console.log(value);
      this.setState({ value });
    };
  }

  handleChange = (event, value) => {
    event.preventDefault();
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Cart"/>
            <Tab label="Pending Orders" />
          </Tabs>
        </AppBar>
        {value === 0 && <ShoppingCart changeToPending={this.changeToPending}/>}
        {value === 1 && <PendingOrderTable/>}
      </div>
    );
  }
}

MainCartView.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainCartView);
