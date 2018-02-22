import React from 'react';
import Paper from 'material-ui/Paper';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import PropTypes from 'prop-types';

import {
  FilteringState,
  IntegratedFiltering,
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableFilterRow,
  TableEditColumn,
  TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';

import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as logActions from '../../interface/logInterface';

//TODO: get user data
// const sessionId = testConfig.sessionId;
var pickerStyle = {
  color: 'white',
  width: '160px'
};

var sessionId = "";

var isAdmin =  "";
// JSON.parse(localStorage.getItem('user')).isAdmin;

const Cell = (props)=>{
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
      //filters: [{ columnName: 'date', value: this.startDate }],
      //editingRowIds: [],
      //rowChanges: {},
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
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
    isAdmin = JSON.parse(localStorage.getItem('user')).isAdmin;
  }


  componentDidMount() {
    this.loadLogInfo();
  }

  async loadLogInfo(){
      var rawData = [];
      sessionId = JSON.parse(localStorage.getItem('user'))._id;
      rawData = await logActions.getAllLogsAsync(sessionId);
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
    const { integratedFilteringColumnExtensions, rows,columns, dates, startDate, endDate, filters, unchangedRows} = this.state;

    return (
      <Paper>
      <div>Filter by Timespan </div>
      <br/>
      <DatePickerInput style={pickerStyle}
          onChange={this.handleStartDateChange}
          value={this.state.startDate}
          className='my-custom-datepicker-component'
      />
      <DatePickerInput style={pickerStyle}
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

          <Table cellComponent={Cell}/>
          <TableHeaderRow />
          <TableFilterRow />
        </Grid>
      </Paper>
    );
  }
}

// Storage.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default Log;
