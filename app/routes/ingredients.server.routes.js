var ingredients = require('../../app/controllers/ingredients.server.controller');

module.exports = function(app) {
    app.route('/ingredients').post(ingredients.create).get(ingredients.list);
    app.route('/ingredients/ingredient/:ingredientName').get(ingredients.read).put(ingredients.update).delete(ingredients.delete);

    app.param('ingredientName', ingredients.ingredientByID);

};