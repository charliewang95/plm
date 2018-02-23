var formulas = require('../controllers/formulas.server.controller');

module.exports = function(app) {
    app.route('/formulas/user/:userId').post(formulas.create).get(formulas.list);
    app.route('/formulas/formula/:formulaId/user/:userId').get(formulas.read).put(formulas.update).delete(formulas.delete);
    //app.route('/formulas/bulkImport').post(formulas.bulkImportFormulas);
    app.route('/formulas/checkout/formula/:formulaId/amount/:quantity/user/:userId').delete(formulas.checkout);
};