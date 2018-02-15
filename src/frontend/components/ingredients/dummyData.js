const data = {
    tablePage:{
    items: [
        {id : 0, name: "pepper",packageName: "sack",temperatureZone: "warehouse",
        vendors: "Target/10, Walmart/20",nativeUnit: "cans", numUnitPerPackage: 4},
        {id : 1, name: "peas",packageName: "sack",temperatureZone: "freezer",
        vendors: "vendor3/20, vendor4/30",nativeUnit: "bags", numUnitPerPackage: 10},
        {id : 2, name: "oil",packageName: "pail",temperatureZone: "warehouse",
        vendors: "target/35", nativeUnit: "drum", numUnitPerPackage: 20},
        {id : 3, name: "milk",packageName: "sack",temperatureZone: "refrigerator",
        vendors: "vendor1/10, vendor2/20",nativeUnit: "gallons", numUnitPerPackage: 10},
      ],

   vendor_options2 : [
          { value: 'target', label: 'Target' },
          { value: 'walmart', label: 'Walmart' },
          { value: 'vendor4', label: 'vendor4' },
          { value: 'vendor5', label: 'vendor5' },
          { value: 'vendor6', label: 'vendor6' },
          { value: 'vendor7', label: 'vendor7' },
          { value: 'vendor8', label: 'vendor8' },
          { value: 'vendor9', label: 'vendor9' },
          { value: 'vendor10', label: 'vendor10' }
       ],

  /* Replace with the data from the back end */
  ingredient_options : ['salt','pepper','cabbage','honey','lemons'],

  /* Replace with the data from the back end -- filtered based on ingredients */
   vendor_options : ['target','wholefoods','li ming','panera','harris teeters'],

  package_options: ['sack', 'pail', 'drum', 'supersack', 'truckload', 'railcar'],

   // package_options: [{value: 'sack', label: 'sack'},
   //  {value: 'pail', label: 'pail'},
   //  {value: 'drum', label: 'drum'},
   //  {value: 'supersack', label: 'supersack'},
   //  {value: 'truckload', label: 'truckload'},
   //  {value: 'railcar', label: 'railcar'}],


  //  temperatureZone_options: [
  //   { value: 'freezer', label: 'frozen' },
  //   { value: 'warehouse', label: 'room temperature' },
  //   { value: 'refrigerator', label: 'refrigerated' },
  // ],
  inventoryData: [
    {id: 0, inventoryId: " ID1", ingredientId: " ID1", ingredientName: "Salt ", temperatureZone: "frozen",
    quantity: "500", packageName:"Sack"},
    {id: 1, inventoryId: " ID2",ingredientId: " ID2", ingredientName: "Pepper ", temperatureZone: "refrigerated",
     quantity: "500", packageName:"Sack"},
    {id: 2, inventoryId: " ID3",ingredientId: " ID3", ingredientName: "Oil ", temperatureZone: "warehouse",
    quantity: "500",packageName:"Supersack"},
    {id: 3, inventoryId: " ID4",ingredientId: " ID4", ingredientName: "Rice ", temperatureZone: "frozen",
    quantity: "500", packageName:"Railcar"},
    {id: 4, inventoryId: " ID5",ingredientId: " ID5", ingredientName: "Chickpeas ", temperatureZone: "refrigerated",
     quantity: "500", packageName: "Drum"},
  ],

   temperatureZone_options:['freezer', 'refrigerator', 'warehouse'],
 },
};

export default data;
