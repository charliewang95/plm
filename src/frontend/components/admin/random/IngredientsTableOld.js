import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow,TableFooter, TableRowColumn} from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {pink500, grey200, grey500} from 'material-ui/styles/colors';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import IconButton from 'material-ui/IconButton';


import PageBase from '../home/PageBase/PageBase';
import Data from './testIngredients.js';

import {Link} from 'react-router-dom';

const styles = {
  floatingActionButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
  },
  editButton: {
    fill: grey500
  },
  columns: {
    id: {
      width: '10%'
    },
    name: {
      width: '40%'
    },
    price: {
      width: '20%'
    },
    category: {
      width: '20%'
    },
    edit: {
      width: '10%'
    }
  }
};

export default class IngredientsTable extends React.Component {

  constructor(props) {
    super(props);
  }

  handleNextButtonClick = event => {
    this.handleChangePage(event, this.props.page - 1);
  };

   handleBackButtonClick = event => {
    this.handleChangePage(event, this.props.page + 1);
  };

  handleChangePage = (event, page) => {
      this.setState({ page });
    };

  render() {
    return(
      < div >
        <Link to='/addIngredientForm' >
          <FloatingActionButton style={styles.floatingActionButton} backgroundColor={pink500}>
            <ContentAdd />
          </FloatingActionButton>
        </Link>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderColumn style={styles.columns.name}>ID</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.package}>Name</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.temperature}>Price</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.vendors}>Category</TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.edit}>Edit</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Data.tablePage.items.map(item =>
              <TableRow key={item.name}>
                {/* <TableRowColumn style={styles.columns.name}>{item.name}</TableRowColumn> */}
                <TableRowColumn style={styles.columns.package}>{item.pkg}</TableRowColumn>
                <TableRowColumn style={styles.columns.temperature}>{item.temperature}</TableRowColumn>
                <TableRowColumn style={styles.columns.vendors}>{item.vendors}</TableRowColumn>
                <TableRowColumn style={styles.columns.edit}>
                  <Link className="button" to="/form">
                    <FloatingActionButton zDepth={0}
                                          mini={true}
                                          backgroundColor={grey200}
                                          iconStyle={styles.editButton}>
                      <ContentCreate  />
                    </FloatingActionButton>
                  </Link>
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
          <TableRow>
            <TableRowColumn style={styles.footerContent}>
              <IconButton onClick={() => {this.handleBackButtonClick()}}>
                <ChevronLeft/>
              </IconButton>
              <IconButton onClick={() => {this.handleNextButtonClick()}}>
                <ChevronRight/>
              </IconButton>
            </TableRowColumn>
            <TableRowColumn style={styles.footerText} />
          </TableRow>
        </TableFooter>
        </Table>
      </div>
    );
  }
}
