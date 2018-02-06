import React from 'react';
import Paper from 'material-ui/Paper';
import {
  Grid,
  Table,
  TableHeaderRow,PagingPanel,DragDropProvider,TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';
import {
  SortingState, PagingState,
  IntegratedPaging, IntegratedSorting,
} from '@devexpress/dx-react-grid';
import Styles from  'react-select/dist/react-select.css';
import { withStyles } from 'material-ui/styles';
import dummyData from '../orders/dummyData';
import * as ingredientActions from '../../interface/ingredientInterface';


import * as testConfig from '../../../resources/testConfig.js';


const userId = "5a765f3d9de95bea24f905d9";
// const sessionId = testConfig.sessionId;
var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Ingredient Name' },
        { name: 'moneySpent', title: 'Expenditure (Orders) /$ ' },
        { name: 'moneyProd', title: 'Expenditure (Production) /$' },
      ],
      rows: [],
      sorting:[],
      currentPage: 0,
      pageSize: 0,
      pageSizes: [5, 10, 20],
      columnOrder: ['name', 'moneySpent', 'moneyProd'],
    };
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };

  }

  componentDidMount(){
    this.loadAllIngredients();
  }

  async loadAllIngredients(){
      var rawData = [];

    // try{
       if(READ_FROM_DATABASE){
         sessionId = JSON.parse(localStorage.getItem('user'))._id;
         rawData = await ingredientActions.getAllIngredientsAsync(sessionId);
       }else{
         rawData = dummyData;
       }
     // }catch(e){
       // console.log("Error passed to front end");
       // alert(e);
     // }
     // adds integer values as row id
     var processedData = [...rawData.map((row, index)=> ({
         id: index,...row,
       })),
     ];
     this.setState({rows:processedData});
   }


  render() {
    const {classes,} = this.props;
    const { rows, columns ,sorting,currentPage,
      pageSize,pageSizes,columnOrder} = this.state;
    return (
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
        >
          <SortingState
            sorting={sorting}
            onSortingChange={this.changeSorting}
          />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />

          <IntegratedSorting />
          <IntegratedPaging />
          <DragDropProvider />

          <Table />

          <TableColumnReordering
            order={columnOrder}
            onOrderChange={this.changeColumnOrder}
          />

          <TableHeaderRow showSortingControls />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>
      </Paper>
    );
  }
}
