var inventories = require('../../app/controllers/inventories.server.controller');

module.exports = function(app) {
    app.route('/inventories/').post(inventories.create).get(inventories.list);
    app.route('/inventories/user/:userName').post(inventories.create).get(inventories.listPartial);
    app.route('/inventories/inventory/:inventoryName/user/:userName').get(inventories.read).put(inventories.update).delete(inventories.delete);

    //app.param('inventoryName', inventories.inventoryByID);

};