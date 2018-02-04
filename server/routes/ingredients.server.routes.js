var ingredients = require('../controllers/ingredients.server.controller');

module.exports = function(app) {
    app.route('/ingredients/user/:userId').post(ingredients.create).get(ingredients.list);
    app.route('/ingredients/ingredient/:ingredientId/user/:userId').get(ingredients.read).put(ingredients.update).delete(ingredients.delete);

};