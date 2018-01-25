var vendors = require('../../app/controllers/vendors.server.controller');
var utils = require('../utils/utils');

module.exports = function(app) {
    app.route('/vendors/user/:userName').post(vendors.create)
    app.route('/vendors/user/:userName').get(vendors.list);
    app.route('/vendors/vendor/:vendorName').get(vendors.read).delete(vendors.delete);
    //app.route('/vendors/:vendorName').put(vendors.update).validate();

    //app.param('userName', utils.checkAdmin);
    app.param('vendorName', vendors.vendorByID);
};