/**
 * Created by Дмитрий on 15.03.2017.
 */
var prefix = '';
var item_controller = require('./../controllers/item_controller');
var link_controller = require('./../controllers/item_link_controller');


var setRoutes = function(app) {
    app.get(prefix.concat('/get_item/'), item_controller.getItemAndLinks);

    app.get('/get_item/get_ontology/', link_controller.getNodesAndItem);
    //app.get(prefix.concat('/get_item/get_nodes'), item_controller.getNodesForItem)
    app.post('/add_link_for_item/', link_controller.addLinkForItem);
};
module.exports.setRoutes = setRoutes;






