var orders = require('../../app/controllers/orders.server.controller');

module.exports = function(app) {
    app.route('/orders').post(orders.create).get(orders.list);
    app.route('/orders/user/:userName').post(orders.create).get(orders.listPartial);
    app.route('/orders/order/:orderName/user/:userName').get(orders.read).put(orders.update).delete(orders.delete);

    //app.param('orderName', orders.orderByID);

};