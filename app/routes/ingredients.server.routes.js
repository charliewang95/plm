var ingredients = require('../../app/controllers/ingredients.server.controller');

module.exports = function(app) {
    app.route('/ingredients/user/:userName').post(ingredients.create).get(ingredients.list);
    app.route('/ingredients/ingredient/:ingredientName/user/:userName').get(ingredients.read).put(ingredients.update).delete(ingredients.delete);

    //app.param('ingredientName', ingredients.ingredientByID);

};