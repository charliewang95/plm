import React from 'react';
import Paper from 'material-ui/Paper';
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
        { name: 'date', title: 'Date' },
      ],
      rows:[],
      //editingRowIds: [],
      //rowChanges: {},
    };

    //this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });

//    this.changeRowChanges = (rowChanges) => {
//      console.log(" ROW CHANGES: ");
//      this.setState({ rowChanges });
//    }

//    var temp = this;
//    this.commitChanges = async ({ changed}) => {
//
//      let { rows } = this.state;
//
//      console.log(JSON.stringify(rows));
//      console.log("changed " + JSON.stringify(changed));
//
//      if(changed){
//
//        for(var i = 0; i < rows.length;i++){
//
//          console.log( " Changed Id " + changed[rows[i].id]);
//          if(changed[rows[i].id]){
//            const re = /^[0-9\b]+$/;
//            var oldRow = rows[i];
//            var oldCap = rows[i].capacity;
//            var enteredQuantity = changed[rows[i].id].capacity;
//                if (!re.test(enteredQuantity)) {
//                  alert(" Quantity must be a number.");
//                }
//                else {
//                    rows[i].capacity = enteredQuantity;
//                }
//            console.log("id " + rows[i]._id);
//            console.log("zone " + rows[i].temperatureZone);
//
//
//              }
//            }
//          }
//        }
//        this.commitChanges = this.commitChanges.bind(this);
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

   var processedData = [...rawData.map((row, index)=> ({
       id:index,...row,
     })),
   ];
   this.setState({rows:processedData});
  }

  render() {
    // const {classes} = this.props;
    const { rows,columns} = this.state;

    return (
      <Paper>
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
