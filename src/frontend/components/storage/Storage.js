import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';

import {
  EditingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableColumnReordering,
} from '@devexpress/dx-react-grid-material-ui';

import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import Button from 'material-ui/Button';
import * as storageActions from '../../interface/storageInterface';

import * as testConfig from '../../../resources/testConfig.js'

import dummyData from './dummyData';

//TODO: get user data
const sessionId = testConfig.sessionId;
const READ_FROM_DATABASE = testConfig.READ_FROM_DATABASE;
var  isAdmin= true;
const userId = "user";

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

const EditCell = (props) => {
  if(props.column.name == 'capacity'){
    return <TableEditRow.Cell {...props} />;
  };
  return <Cell {...props} />;
};

EditCell.propTypes = {
  column: PropTypes.shape({ name: PropTypes.string }).isRequired,
};

const commandComponents = {
  edit:    EditButton,
  commit:  CommitButton,
  cancel:  CancelButton,
};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};
Command.propTypes = {
  id: PropTypes.string.isRequired,
  onExecute: PropTypes.func.isRequired,
};

const getRowId = row => row.id;


class Storage extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'capacity', title: 'Capacity (lbs)' },
      ],
      rows:[],
      editingRowIds: [],
      rowChanges: {},
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });

    this.changeRowChanges = (rowChanges) => {
      console.log(" ROW CHANGES: ");
      this.setState({ rowChanges });
    }

    this.commitChanges = ({ changed}) => {
      let { rows } = this.state;

      console.log(JSON.stringify(rows));
      console.log("changed " + JSON.stringify(changed));

      if(changed){
        for(var i = 0; i < rows.length;i++){
          console.log( " Changed Id " + changed[rows[i].id]);
          if(changed[rows[i].id]){
            rows[i].capacity = changed[rows[i].id].capacity;

            console.log("id " + rows[i]._id);
            console.log("zone " + rows[i].temperatureZone);
            console.log("capacity " + rows[i].capacity);

            //TODO: Update the Storage
//            try{
//              storageActions.updateStorage(rows[i]._id,
//                rows[i].temperatureZone, rows[i].capacity,sessionId);
//            }catch(e){
//              console.log('An error passed to the front end!')
//              //TODO: error handling in the front end
//              alert(e);
//            }
            storageActions.updateStorage(rows[i]._id,
                rows[i].temperatureZone, rows[i].capacity,sessionId, function(res){
                    if (res.status == 400) {
                        alert(res.data);
                    }
               });
          }
        }
      }
    }
  }

  componentDidMount() {
    this.loadStorageInfo();
  }

  async loadStorageInfo(){
    var rawData = [];
    if(READ_FROM_DATABASE){
      rawData = await storageActions.getAllStoragesAsync(sessionId);
    } else {
     rawData = dummyData;
    }

   var processedData = [...rawData.map((row, index)=> ({
       id:index,...row,
     })),
   ];
   this.setState({rows:processedData});
  }

  render() {
    const {classes} = this.props;
    const { rows, columns ,editingRowIds,rowChanges} = this.state;

    return (
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          {isAdmin &&
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.changeRowChanges}
              onCommitChanges={this.commitChanges}
            />}

          <Table cellComponent={Cell}/>
          <TableHeaderRow />
          {isAdmin &&
            <TableEditRow
              cellComponent={EditCell}
            />
          }
          {isAdmin &&
            <TableEditColumn
              width={120}
              showEditCommand
              commandComponent={Command}
            />}

        </Grid>
      </Paper>
    );
  }
}

Storage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Storage;
