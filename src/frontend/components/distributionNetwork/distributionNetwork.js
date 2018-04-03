import * as React from 'react';
import Paper from 'material-ui/Paper';
import {
  SelectionState,
  PagingState,
  IntegratedPaging,
  IntegratedSelection,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

import { Redirect } from 'react-router';
import RaisedButton from 'material-ui/Button';
import {Link} from 'react-router-dom';
import SellProductsReview from './sellProductsReview.js';

import testData from './testData.js'



var userId;
var sessionId;
var isAdmin;
var isManager;



export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'productName', title: 'Product Name' },
        { name: 'numUnit', title: 'Total Quantity' },
        { name: 'numSold', title: 'Sold Quantity' },
        { name: 'numUnsold', title: 'Unsold Quantity' },
      ],
      fireRedirect:false,
      rows: [],
      selection: [],
      pageSizes: [20, 50, 200, 500],
      currentPage:0,
      pageSize:20,
      selectedRows:[],
    };

    this.changeSelection = selection => {
      console.log("selection");
      console.log(selection);
      var temp = this;
      let {rows} = temp.state;
      var selected = rows.filter(row => selection.indexOf(row.id) > -1)
      console.log(selected);

      this.setState({selectedRows:selected});
      this.setState({ selection });
    }
    this.loadDistributionNetworkData = this.loadDistributionNetworkData.bind(this);
    this.reviewProductsToSell = this.reviewProductsToSell.bind(this);
  }

  componentWillMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
    isManager = JSON.parse(sessionStorage.getItem('user')).isManager;
    userId = JSON.parse(sessionStorage.getItem('user'))._id;

    this.loadDistributionNetworkData();
  }

  async loadDistributionNetworkData(){
    var data = testData;
    console.log("load distribution network data");
    var processedData = [...data.map((row, index)=> ({
        id:index,...row,
        numUnsold:Math.round((row.numUnit-row.numSold)*100)/100,
        })),
      ];

    this.setState({rows:processedData});
  }

  reviewProductsToSell(){
    console.log("send products to sell");
    var temp = this;
    let {rows} = temp.state;
    console.log(this.state.selection);
    console.log(rows);

    temp.setState({fireRedirect:true});
  }

  render() {
    const { rows, columns, selection,pageSizes,currentPage ,pageSize,fireRedirect,selectedRows} = this.state;

    return (
      <div>
        <span>Total rows selected: {selection.length}</span>
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
          >
            <PagingState
              currentPage={currentPage}
              onCurrentPageChange={this.changeCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={this.changePageSize}
            />
            <SelectionState
              selection={selection}
              onSelectionChange={this.changeSelection}
            />
            <IntegratedPaging />
            <IntegratedSelection />
            <Table />
            <TableHeaderRow />
            <TableSelection showSelectAll />
            <PagingPanel
              pageSizes={pageSizes}
            />
          </Grid>
          <RaisedButton raised
                color="primary"
                disabled = {this.state.selection.length==0}
                style = {{marginLeft: 550, marginBottom: 30}}
                component={Link} to={{pathname: '/sell-products-review', state:{selectedRows:this.state.selectedRows}}}
                // onClick = {(event) => this.reviewProductsToSell(event)}
                primary="true">Initiate Sale</RaisedButton>
        </Paper>
        {fireRedirect && (
          <Redirect to={'/sell-review'}/>
        )}
      </div>
    );
  }
}
