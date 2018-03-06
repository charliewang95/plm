var ingredients = require('../controllers/ingredients.server.controller');

module.exports = function(app) {
    app.route('/ingredients/user/:userId').post(ingredients.create).get(ingredients.list);
    app.route('/ingredients/ingredient/:ingredientId/user/:userId').get(ingredients.read).put(ingredients.update).delete(ingredients.delete);
    //app.route('/ingredients/bulkImport').post(ingredients.bulkImportIngredients);
    app.route('/ingredients/ingredientNames/user/:userId').get(ingredients.listNames);
    app.route('/ingredients/allIngredients/user/:userId').get(ingredients.listAllIngredients);
    app.route('/ingredients/allIntermediate/user/:userId').get(ingredients.listAllIngredients)
};