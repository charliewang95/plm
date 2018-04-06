import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import FinancialReport from './financialReport';
import ProductionReport from './productionReport';
import FreshnessReport from './freshnessReport';
import RecallReport from './recallReport';
import ProfitabilityReport from './profitabilityReport';

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

class ScrollableTabsButtonAuto extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Paper>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            <Tab label="Spending Report" />
            <Tab label="Production Report" />
            <Tab label="Freshness Report" />
            <Tab label="Recall Report" />
            <Tab label="Profitability Report" />
          </Tabs>
        </AppBar>
        {value === 0 && <FinancialReport/>}
        {value === 1 && <ProductionReport/>}
        {value === 2 && <FreshnessReport/>}
        {value === 3 && <RecallReport/>}
        {value === 4 && <ProfitabilityReport/>}
      </Paper>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonAuto);
