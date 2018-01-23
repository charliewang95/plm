var vendors = require('../../app/controllers/vendors.server.controller');

module.exports = function(app) {
    app.route('/vendors').post(vendors.create).get(vendors.list);
    app.route('/vendors/:vendorName').get(vendors.read).put(vendors.update).delete(vendors.delete);

    app.param('vendorName', vendors.vendorByID);

};