import React from 'react';
import Paper from 'material-ui/Paper';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import {Link} from 'react-router-dom';
import {
  FilteringState,
  IntegratedFiltering,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableFilterRow,
  TableEditColumn,
  TableColumnReordering,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as logActions from '../../interface/logInterface';
import * as ingredientActions from '../../interface/ingredientInterface';

//TODO: get user data
// const sessionId = testConfig.sessionId;
var pickerStyle = {
  color: 'white',
  width: '160px'
};

var sessionId = "";

var isAdmin =  "";
// JSON.parse(sessionStorage.getItem('user')).isAdmin;

const Cell = (props)=>{
  if(props.column.name=="item" && props.row.model == 'ingredients'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/ingredient-details', state:{ingredientId: props.row.itemId, fromLogs: true} }}>{props.row.item}</Link>
    </Table.Cell>
  }
  return <Table.Cell {...props}
    style={{
        whiteSpace: "normal",
        wordWrap: "break-word"
      }}/>
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

//const EditCell = (props) => {
//  if(props.column.name == 'capacity'){
//    return <TableEditRow.Cell {...props} />;
//  };
//  return <Cell {...props} />;
//};
//
//EditCell.propTypes = {
//  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
//};

//const commandComponents = {
//  edit:    EditButton,
//  commit:  CommitButton,
//  cancel:  CancelButton,
//};

//const Command = ({ id, onExecute }) => {
//  const CommandButton = commandComponents[id];
//  return (
//    <CommandButton
//      onExecute={onExecute}
//    />
//  );
//};
//Command.propTypes = {
//  id: PropTypes.string.isRequired,
//  onExecute: PropTypes.func.isRequired,
//};

const datePredicate = (value, filter) => {
    console.log(value);
    value > this.state.startDate
}

const getRowId = row => row.id;

class Log extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'username', title: 'Username' },
        { name: 'action', title: 'Action' },
        { name: 'model', title: 'Model' },
        { name: 'item', title: 'Entity' },
        { name: 'date', title: 'Timestamp' },
      ],
      integratedFilteringColumnExtensions: [
        { columnName: 'date', predicate: datePredicate },
      ],
      rows:[],
      unchangedRows: [],
      dates: [],
      startDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      endDate: new Date(2018, 11, 31, 23, 59, 59, 0),
      currentPage: 0,
      pageSize: 10,
      pageSizes: [10, 25, 50],
      //filters: [{ columnName: 'date', value: this.startDate }],
      //editingRowIds: [],
      //rowChanges: {},
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
    //this.changeFilters = filters => this.setState({ filters });
   }

  handleStartDateChange(date) {
      this.setState({
        startDate: date
      }, function(){
        console.log(this.state.startDate);
        var newRows = [];
        for (var i = 0; i<this.state.unchangedRows.length; i++) {
            if (Number(this.state.unchangedRows[i].date.slice(0,4))>date.getFullYear() ||
                Number(this.state.unchangedRows[i].date.slice(0,4))==date.getFullYear() && (Number(this.state.unchangedRows[i].date.slice(5,7))>date.getMonth()+1 ||
                Number(this.state.unchangedRows[i].date.slice(5,7))==date.getMonth()+1 && Number(this.state.unchangedRows[i].date.slice(8,10))>=date.getDate())) {
                newRows.push(this.state.unchangedRows[i]);
            }
        }
        this.setState({
            rows: newRows
        });
      });

  };

  handleEndDateChange(date) {
      this.setState({
        endDate: date
      }, function(){
        console.log(this.state.endDate);
            var newRows = [];
            for (var i = 0; i<this.state.unchangedRows.length; i++) {
                if (Number(this.state.unchangedRows[i].date.slice(0,4))<date.getFullYear() ||
                    Number(this.state.unchangedRows[i].date.slice(0,4))==date.getFullYear() && (Number(this.state.unchangedRows[i].date.slice(5,7))<date.getMonth()+1 ||
                    Number(this.state.unchangedRows[i].date.slice(5,7))==date.getMonth()+1 && Number(this.state.unchangedRows[i].date.slice(8,10))<=date.getDate())) {
                    newRows.push(this.state.unchangedRows[i]);
                }
            }
            this.setState({
                rows: newRows
            });
      });
  }

  componentWillMount(){
    isAdmin = JSON.parse(sessionStorage.getItem('user')).isAdmin;
  }


  componentDidMount() {
    this.loadLogInfo();
  }

  async loadLogInfo(){
      var rawData = [];
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await logActions.getAllLogsAsync(sessionId);
      rawData = rawData.reverse();
      var tempDates = [];
       for (var i = 0; i<rawData.length; i++) {
           var date = rawData[i].date;

           var year = date.slice(0, 4);
           var month = date.slice(5, 7);
           var day = date.slice(8, 10);
           var hours = date.slice(11, 13);
           var minutes = date.slice(14, 16);
           var seconds = date.slice(17, 19);
           var milliseconds = date.slice(20, 22);
           tempDates[i] = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
           rawData[i].date = date.replace('T',' ').replace('Z',' ');
       }

       var processedData = [...rawData.map((row, index)=> ({
           id:index,...row,
         })),
       ];

       this.setState({dates:tempDates});
       this.setState({rows:processedData});
       this.setState({unchangedRows:processedData});
  }

  render() {
    // const {classes} = this.props;
    const { integratedFilteringColumnExtensions, rows,columns, dates, startDate, endDate, filters, unchangedRows, 
      pageSize, pageSizes, currentPage} = this.state;

    return (
      <Paper>
      <div> Start Date: </div>
        <DatePickerInput style={pickerStyle}
          readOnly = {true}
          onChange={this.handleStartDateChange}
          value={this.state.startDate}
          className='my-custom-datepicker-component'
        />
        <br/>
        <div> End Date: </div>
      <DatePickerInput style={pickerStyle}
          readOnly = {true}
          onChange={this.handleEndDateChange}
          value={this.state.endDate}
          className='my-custom-datepicker-component'
        />

        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          <FilteringState defaultFilters={[]} />
          <IntegratedFiltering />
          <PagingState
            currentPage={currentPage}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          <IntegratedPaging />
          <Table cellComponent={Cell}/>
          <TableHeaderRow />
          <TableFilterRow />
          <PagingPanel
            pageSizes={pageSizes}
          />
        </Grid>

      </Paper>
    );
  }
}

// Storage.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default Log;
