/**
 * Created by Дмитрий on 07.03.2017.
 */
var prefix = '/tags';
var item_controller = require('./../controllers/item_controller');
var link_controller = require('./../controllers/item_link_controller');

var setRoutes = function(app) {
    app.get('/tags/', link_controller.getAllTags);
    app.post('/create_tag/', link_controller.getAllTags);
};
module.exports.setRoutes = setRoutes;