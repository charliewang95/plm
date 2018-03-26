import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
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
  TableEditRow,
  TableFilterRow,
  TableHeaderRow,
  TableColumnReordering,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

// import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as productActions from '../../interface/productInterface';

import * as testConfig from '../../../resources/testConfig.js';
import productData from './testData';


var pickerStyle = {
  color: 'white',
  width: '160px'
};

var sessionId = "";
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;

var isAdmin =  "";
// JSON.parse(sessionStorage.getItem('user')).isAdmin;


const Cell = (props)=>{
  if(props.column.name=='name'){
    return <Table.Cell {...props}>
    <Link to={{pathname: '/product-details', state:{details: props.row} }}>{props.row.name}</Link>
    </Table.Cell>
  }else{
  return <Table.Cell {...props}/>
}
};

Cell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const datePredicate = (value, filter) => {
    console.log(value);
    value > this.state.startDate
}

const getRowId = row => row.id;

class Product extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'name', title: 'Name' },
        { name: 'numUnit', title: 'Number of Units' },
        { name: 'date', title: 'Timestamp' },
        { name: 'lotNumberUnique', title: 'Lot Number' },
      ],
      rows:[],
      integratedFilteringColumnExtensions: [
        { columnName: 'date', predicate: datePredicate },
      ],
      unchangedRows: [],
      dates: [],
      startDate: new Date(2018, 0, 1, 0, 0, 0, 0),
      endDate: new Date(2018, 11, 31, 23, 59, 59, 0),
      currentPage: 0,
      pageSize: 10,
      pageSizes: [100, 250, 500],
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.changeCurrentPage = currentPage => this.setState({ currentPage });
    this.changePageSize = pageSize => this.setState({ pageSize });
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
    this.loadProductInfo();
  }

  async loadProductInfo(){
      var rawData = [];
      sessionId = JSON.parse(sessionStorage.getItem('user'))._id;
      rawData = await productActions.getAllProductsAsync(sessionId);
      // rawData = productData;
      var tempDates = [];
      for (var i = 0; i<rawData.length; i++) {
        //TODO: Change this with real Date - remove new Date later
          var date = new Date(rawData[i].date).toISOString();
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
      var processedData = [];
      if(!rawData){
        processedData = [...rawData.map((row, index)=> ({
            id:index,...row,
          })),
        ];
      }
      

      this.setState({dates:tempDates});
      this.setState({rows:processedData});
      this.setState({unchangedRows:processedData});
  }

  render() {
    // const {classes} = this.props;
    const { rows,columns ,editingRowIds,rowChanges,integratedFilteringColumnExtensions,
       dates, startDate, endDate, filters, unchangedRows,
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


export default Product;
