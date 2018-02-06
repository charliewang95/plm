var carts = require('../controllers/carts.server.controller');

module.exports = function(app) {
    app.route('/carts/user/:userId').post(carts.create).get(carts.list);
    app.route('/carts/cart/:cartId/user/:userId').get(carts.read).put(carts.update).delete(carts.delete);
    app.route('/carts/checkout/user/:userId').delete(carts.deleteAll);
};