var vendors = require('../../app/controllers/vendors.server.controller');

module.exports = function(app) {
    app.route('/vendors').post(vendors.create).get(vendors.list);
    app.route('/vendors/vendor/:vendorName').get(vendors.read).delete(vendors.delete);
    //app.route('/vendors/:vendorName').put(vendors.update).validate();

    //app.param('userId', vendors.checkAdmin);
    app.param('vendorName', vendors.vendorByID);
};