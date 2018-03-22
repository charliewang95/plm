var ingredients = require('../controllers/ingredients.server.controller');

module.exports = function(app) {
    app.route('/ingredients/user/:userId').post(ingredients.create).get(ingredients.list);
    app.route('/ingredients/ingredient/:ingredientId/user/:userId').get(ingredients.read).put(ingredients.update).delete(ingredients.delete);
    //app.route('/ingredients/bulkImport').post(ingredients.bulkImportIngredients);
    app.route('/ingredients/ingredientNames/user/:userId').get(ingredients.listNames);
    app.route('/ingredients/allIngredients/user/:userId').get(ingredients.listIngredients);
    app.route('/ingredients/allIntermediates/user/:userId').get(ingredients.listIntermediate);
    app.route('/ingredients/allLotNumbers/ingredient/:ingredientId/user/:userId').get(ingredients.listLotNumbers);
    app.route('/ingredients/oldestLot/ingredient/:ingredientId/user/:userId').get(ingredients.getOldestLot);
    app.route('/ingredients/recall/ingredient/:ingredientName/lot/:lotNumber/user/:userId').get(ingredients.getRecall);
    app.route('/ingredients/fresh/ingredient/:ingredientName/user/:userId').get(ingredients.getFresh);
};