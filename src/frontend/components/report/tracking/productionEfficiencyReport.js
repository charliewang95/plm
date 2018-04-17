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
import { PureComponent, Fragment } from 'react';
import { IconButton, Icon, InputAdornment } from 'material-ui';
import {  DateTimePicker } from 'material-ui-pickers';
import KeyboardArrowLeft from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight';
import DateRangeIcon from 'material-ui-icons/DateRange';
import AccessTimeIcon from 'material-ui-icons/AccessTime';
import KeyboardIcon from 'material-ui-icons/Keyboard';
import * as productionLineActions from '../../../interface/productionLineInterface.js';
import Button from 'material-ui/Button';
import PubSub from 'pubsub-js';

// const sessionId = testConfig.sessionId;
var sessionId = "";

const LeftIconButton = () => (
  <IconButton> KeyboardArrowLeft </IconButton>
);


export default class ProductionEfficiencyReport extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'productionLineName', title: 'Production Line ' },
        { name: 'lineEfficiency', title: 'Efficiency (%)' },
      ],
      rows: [],
      sorting:[],
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 50, 100, 500],
      columnOrder: ['name', 'moneySpent', 'moneyProd'],
      startDate:new Date(),
      endDate: new Date(),
      overallEfficiency:'',
    };

    this.loadAllEfficiencies = this.loadAllEfficiencies.bind(this);
    this.changeSorting = sorting => this.setState({ sorting });
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    this.changeColumnOrder = (order) => {
      this.setState({ columnOrder: order });
    };

   this.handleStartDateChange = (date) => {
     console.log("handleStartDateChange");
     console.log(date);
     if(Date.parse(date._d) >  Date.parse(date._i)){
       PubSub.publish('showAlert', "Start date must be earlier than end date.");
     }else{
     this.setState({ startDate:date });
    }
  }

   this.handleEndDateChange = (date) => {
     console.log("handleEndDateChange");
     console.log(date);
     if(Date.parse(date._d) < Date.parse(date._i)){
       PubSub.publish('showAlert', "End date must be later than start date.");
     }else{
       this.setState({endDate:date });
     }
   }
  }

  componentDidMount(){
    sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
    // this.loadAllIngredients();
  }

  async loadAllEfficiencies(event){
    console.log("loadAllEfficiencies");
    event.preventDefault();
    var temp = this;
    var startTime = Date.parse(temp.state.startDate);
    var endTime = Date.parse(temp.state.endDate);

    if(temp.state.startDate._i){
      startTime = Date.parse(temp.state.startDate._d);
    }
    if(temp.state.startDate._d){
      endTime = Date.parse(temp.state.startDate._i);
    }
    console.log(startTime);
    console.log(endTime);

    var rawData = [];
     rawData = await productionLineActions.getEfficiencies(startTime,endTime,sessionId);
     rawData = rawData.data;
     console.log(rawData);

     var processedData = [];
      if(rawData.length > 0){
        processedData = [...rawData.map((row, index)=> ({
            id: index,
            lineEfficiency:(row.efficiency!=null) ? (row.efficiency):0,
            ...row,
          })),
        ];
      }
    console.log(processedData);
    var overallEffSum =0;
    for(var i =0; i < processedData.length;i++){
      var eff = (processedData[i].lineEfficiency!=null) ? Number(processedData[i].lineEfficiency):0;
      overallEffSum+=eff;
    }
    var overallEff =0;
    overallEff = (overallEffSum!=0) ? Math.round((overallEffSum/processedData.length)*100)/100:0;

    temp.setState({rows:processedData});
    temp.setState({overallEfficiency:overallEff});

    }


  render() {
    const {classes,} = this.props;
    const { rows, columns ,sorting,currentPage,
      pageSize,pageSizes,columnOrder,startDate,endDate,overallEfficiency} = this.state;
    return (
      <Paper>
        <Fragment>
        <div>
          <span>Start Date: </span>
            <DateTimePicker
                value={startDate}
                onChange={this.handleStartDateChange}
                leftArrowIcon={<KeyboardArrowLeft/>}
                rightArrowIcon={<KeyboardArrowRight/>}
                dateRangeIcon={<DateRangeIcon/>}
                timeIcon={<AccessTimeIcon/>}
                keyboardIcon={<KeyboardIcon/>}
              />
            </div>
          <br/>
            <div>
             <span>End Date: </span>
            <DateTimePicker
                value={endDate}
                onChange={this.handleEndDateChange}
                leftArrowIcon={<KeyboardArrowLeft/>}
                rightArrowIcon={<KeyboardArrowRight/>}
                dateRangeIcon={<DateRangeIcon/>}
                timeIcon={<AccessTimeIcon/>}
                keyboardIcon={<KeyboardIcon/>}
              />
            </div>
          <br/>
            <div>
              <Button
                raised
                onClick={(event) => this.loadAllEfficiencies(event)}
                color="primary">Get Efficiency</Button>
          </div>

      {/* </MuiPickersUtilsProvider> */}
      </Fragment>

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
        <span>Overall Production Efficiency (%): {overallEfficiency} </span>
      </Paper>
    );
  }
}
