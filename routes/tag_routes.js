/**
 * Created by Дмитрий on 07.03.2017.
 */
var prefix = '/tags';
var item_controller = require('./../controllers/item_controller');
var link_controller = require('./../controllers/item_link_controller');

var setRoutes = function(app) {
    app.get('/tags/', link_controller.getAllTags);
    app.post('/create_tag/', link_controller.createTag);
    app.post('/delete_tag/', link_controller.deleteTag);
    app.post('/add_tag_to_item', link_controller.addTagToItem)
    app.get('/get_tag/', link_controller.getTagAndOntology);
};
module.exports.setRoutes = setRoutes;