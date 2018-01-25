var ingredients = require('../../app/controllers/ingredients.server.controller');

module.exports = function(app) {
    app.route('/ingredients').post(ingredients.create).get(ingredients.list);
    app.route('/ingredients/ingredient/:ingredientId').get(ingredients.read).put(ingredients.update).delete(ingredients.delete);

    app.param('ingredientId', ingredients.ingredientByID);

};