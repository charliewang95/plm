var storages = require('../../app/controllers/storages.server.controller');

module.exports = function(app) {
    app.route('/storages').post(storages.create).get(storages.list);
    app.route('/storages/storage/:storageName').get(storages.read).put(storages.update).delete(storages.delete);

    app.param('storageName', storages.storageByID);

};