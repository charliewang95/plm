import React from 'react';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';


import {
  FilteringState,
  IntegratedFiltering,EditingState
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableFilterRow,
  TableEditRow,
  TableEditColumn,
  TableColumnReordering,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';

import dummyData from './dummyData';
import {EditButton,CommitButton,CancelButton} from '../vendors/Buttons.js';
import ShoppingCartButton from './ShoppingCartButton.js';

//TODO: Get if it ADMIN
var  isAdmin= false;

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
  if(props.column.name == 'quantity'){
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
  addToCart: ShoppingCartButton,
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

const toLowerCase = value => String(value).toLowerCase();
const temperatureZonePredicate = (value, filter) => toLowerCase(value).startsWith(toLowerCase(filter.value));


class Inventory extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'ingredientName', title: 'Ingredient Name' },
        { name: 'temperatureZone', title: 'Temperature Zone' },
        { name: 'quantity', title: 'Quantity (lbs)' },
        { name: 'packageName', title: 'Package Name' },
      ],
      editingRowIds: [],
      rowChanges: {},
      tableColumnExtensions: [
        { columnName: 'ingredientName', align: 'right' },
      ],
      integratedFilteringColumnExtensions: [
        { columnName: 'temperatureZone', predicate: temperatureZonePredicate },
      ],
      rows: [],
      // selection:[]
    };

    this.changeEditingRowIds = editingRowIds => this.setState({ editingRowIds });
    this.changeSelection = selection => this.setState({ selection });
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
            rows[i].quantity = changed[rows[i].id].quantity;
        }
      }
     }
      // TODO: Update Quantity in back end
   }
 };

// Initial loading of data
  componentDidMount() {
    this.loadInventory();
  }

  loadInventory() {
    console.log("LOADING DATA");
    var processedData=[];
    var rawData = dummyData;
    //TODO: Initialize data
    var startingIndex = 0;
    var processedData = [...rawData.map((row, index)=> ({
        id: startingIndex + index,...row,
      })),
    ];

    console.log("processedData " + JSON.stringify(processedData));
    this.setState({rows:processedData});
  }

  render() {
    // const { rows, columns, integratedFilteringColumnExtensions } = this.state;
    const {classes,} = this.props;
    const { rows, columns,editingRowIds,
      rowChanges,tableColumnExtensions,
      integratedFilteringColumnExtensions} = this.state;
    return (
      <Paper>
        <Grid
          allowColumnResizing = {true}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
        >
          {/* <FilteringState defaultFilters={[{ columnName: 'temperatureZone', value: 'frozen' }]} /> */}
          <FilteringState/>
          {isAdmin &&
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={this.changeEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={this.changeRowChanges}
              onCommitChanges={this.commitChanges}
            /> }

          <IntegratedFiltering columnExtensions={integratedFilteringColumnExtensions} />
          <Table cellComponent={Cell}/>
          <TableHeaderRow />
          <TableFilterRow />
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

              {/* <TableEditColumn
                width={120}
                showEditCommand
                commandComponent={Command}
              /> */}

        </Grid>
      </Paper>
    );
  }
}

Inventory.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Inventory;
