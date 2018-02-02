const data = {
    tablePage:{
    items: [
      // ['pepper','sack','room temperature','vendor 1'],
      // ['pepper','sack','room temperature','vendor 1'],
      // ['pepper','sack','room temperature','vendor 1'],
      // ['pepper','sack','room temperature','vendor 1'],
      // ['pepper','sack','room temperature','vendor 1'],
      // ['pepper','sack','room temperature','vendor 1'],

        {id : 0, name: "pepper",pkg: "sack",temperature: "room", vendors: "vendor1/10, vendor2/20"},
        {id : 1, name: "salt",pkg: "sack",temperature: "fridge", vendors: "vendor3/20, vendor4/30"},
        {id : 2, name: "oil",pkg: "pail",temperature: "room", vendors: "target/35"},
        {id : 3, name: "pepper",pkg: "sack",temperature: "room", vendors: "vendor1/10, vendor2/20"},
        // {id : 4, name: "salt",pkg: "sack",temperature: "fridge", vendors: "vendor3/20, vendor4/30"},
        // {id: 5, name: "oil",pkg: "pail",temperature: "room", vendors: "target/35"},
        // {id: 6, name: "pepper",pkg: "sack",temperature: "room", vendors: "vendor1/10, vendor2/20"},
        // {id: 7, name: "salt",pkg: "sack",temperature: "fridge", vendors: "vendor3/20, vendor4/30"},
        // {id: 8, name: "oil",pkg: "pail",temperature: "room", vendors: "target/35"},
      ],

   vendor_options2 : [
          { value: 'vendor1', label: 'vendor1' },
          { value: 'vendor2', label: 'vendor2' },
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

   package_options: ['sail','supersack','drum','railcar','sack'],
   temperature_options:['room temperature','frozen','refrigerator'],
 },
};

export default data;

/* parse data to create objects in order to display */
// export function generateRows() {
//   const data = [];
//   const columns = ['name','package','temperature','vendors'];
//   for(i = 0; i < )
//   const record = {};
//
//     columns.forEach((column) => {
//       let values = columnValues[column];
//
//       if (typeof values === 'function') {
//         record[column] = values({ random, index: i, record });
//         return;
//       }
//
//       while (values.length === 2 && typeof values[1] === 'object') {
//         values = values[1][record[values[0]]];
//       }
//
//       const value = values[Math.floor(random() * values.length)];
//       if (typeof value === 'object') {
//         record[column] = Object.assign({}, value);
//       } else {
//         record[column] = value;
//       }
//     });
//
//     data.push(record);
//   }
//   for(var i=0;i<data.length;i++){
//     console.log("data " + data[i].saleDate);
//   }
//   // console.log(" data " + data[0].name);
//   return data;
// }
