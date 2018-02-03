
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import storage from './dummyData.js';
import EditStorageCapacityButton from './EditStorageCapacityButton';


const styles = theme => ({
  root: {
    width: '80%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 600,
  },
});

class Storage extends Component{
    constructor(props){
      super(props);
      this.state={
        freezer:'',
        refrigerator:'',
        warehouse:'',
      }
    }

    componentDidMount(){
      console.log(" MOunt ");
      this.loadStorageInfo();
    }

    loadStorageInfo(){
      console.log(" Load Storage ");
      const sessionId = '5a6a5977f5ce6b254fe2a91f';
      console.log(storage[0].temperatureZone + storage[0].capacity);
      console.log(storage[0].temperatureZone + storage[0].capacity);
      console.log(storage[0].temperatureZone + storage[0].capacity);

      // var rawData = ingredientInterface.getAllIngredientsAsync(sessionId);
      this.setState({freezer:storage[0].capacity});
      this.setState({refrigerator:storage[1].capacity});
      this.setState({warehouse:storage[2].capacity});
    }


    render(){
      // TODO: Get whether or not the admin has logged in 
      const isAdmin = true;
      const{classes} = this.props;
      // const { freezer, refrigerator, warehouse } = this.state;
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Temperature Zone</TableCell>
                <TableCell>Storage (in lbs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>freezer</TableCell>
                <TableCell >{this.state.freezer}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>refrigerator</TableCell>
                <TableCell>{this.state.refrigerator}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>warehouse</TableCell>
                <TableCell>{this.state.warehouse}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {isAdmin && <EditStorageCapacityButton/>}
        </Paper>
      );
    }
  }
Storage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Storage);
