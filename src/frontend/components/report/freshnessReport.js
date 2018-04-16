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
import freshnessReportData from './testData';

// const sessionId = testConfig.sessionId;
var sessionId = "";
// var userId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;


export default class FreshnessReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        // ingredientName also includes intermediate name
        { name: 'ingredientName', title: 'Ingredient/Intermediate Name' },
        { name: 'averageWaitTime', title: 'Average Wait Time' },
        { name: 'worstWaitTime', title: 'Worst-case Wait Time' },
      ],
      rows: [],
      sorting:[],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'averageWaitTime', 'worstWaitTime'],
      overallFreshness:'',
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
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
     console.log('getting fresh data '+sessionId);
     rawData = await ingredientActions.getFreshAsync(sessionId);
     console.log(rawData);

    var processedData = [];
    if (rawData.data) rawData = rawData.data; // to handle response
    if (rawData){
      processedData = [...rawData.map((row, index)=> ({
         id: index,
         ...row,
         averageWaitTime: row.averageDay + "d  " + row.averageHour + "h " + row.averageMinute + "m",
         worstWaitTime: row.oldestDay + "d  " + row.oldestHour + "h " + row.oldestMinute + "m",
       })),
     ];
    }

    var totalMinutesSum = 0;
    for(var i =0; i < processedData.length;i++){
      totalMinutesSum+=Number(processedData[i].averageDay) * 24 * 60 + Number(processedData[i].averageHour)*60 + Number(processedData[i].averageMinute);
    }
     this.setState({rows:processedData});

     var overallDay = Math.round((totalMinutesSum/24/60)*100)/100;
     var overallHour = Math.round((totalMinutesSum/60%24)*100)/100;
     var overallMin = Math.round((totalMinutesSum % 60)*100)/100;
     var overallFreshness = overallDay + "d  " + overallHour + "h " + overallMin + "m";

     this.setState({overallFreshness:overallFreshness});
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
        <span>Overall Freshness: {this.state.overallFreshness}</span>
      </Paper>
    );
  }
}
