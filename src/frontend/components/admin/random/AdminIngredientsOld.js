import React, {Component} from 'react';
import DataTables from 'material-ui-datatables';
import * as ingredientActions from '../../interface/ingredientInterface.js'

const TABLE_COLUMNS = [
  {
    key: 'name',
    label: 'Name',
  }, 
  {
    key: 'package',
    label: 'Package',
  },
  {
    key: 'temperatureZone',
    label: 'Temperature Zone',
  },
  {
    key: 'vendors',
    label: 'Vendors',
  }
];

const TABLE_DATA = [
  {
    name: 'Frozen yogurt',
    package: '159',
    temperatureZone: '6.0',
    vendors: 'WholeFoods, HarrisTeeter, Krogers',
  }
];
 
class AdminIngredients extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      ingredients: [],
    };
  }

  async loadAllIngredients(){
    const res = await ingredientActions.getAllIngredientsAsync();
    console.log("is this undefined" + res);
    this.setState({ingredients:res.data});
  }

  componentDidMount(){
    this.loadAllIngredients();
  }

  handleFilterValueChange = (value) => {
    // your filter logic
  }
 
  handleSortOrderChange = (key, order) => {
    // your sort logic
  }
 
  render() {
    return (
      <DataTables
        height={'auto'}
        selectable={false}
        showRowHover={true}
        columns={TABLE_COLUMNS}
        data={this.state.ingredients}
        showCheckboxes={false}
        onCellClick={this.handleCellClick}
        onCellDoubleClick={this.handleCellDoubleClick}
        onFilterValueChange={this.handleFilterValueChange}
        onSortOrderChange={this.handleSortOrderChange}
        page={1}
        count={100}
      />
    );
  }
}

export default AdminIngredients