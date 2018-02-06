var inventories = require('../controllers/inventories.server.controller');

module.exports = function(app) {
    app.route('/inventories/user/:userId').post(inventories.create).get(inventories.list);
    app.route('/inventories/inventory/:inventoryId/user/:userId').get(inventories.read).put(inventories.update).delete(inventories.delete);
    app.route('/inventories/package/:packageName/user/:userId').get(inventories.getCertainPackage);
    app.route('/inventories/temp/:tempName/user/:userId').get(inventories.getCertainTemp);
};