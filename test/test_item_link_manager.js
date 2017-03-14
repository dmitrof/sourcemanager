/**
 * Created by Дмитрий on 10.03.2017.
 */
var dbWrapper = require('./../modules/db_wrapper');

dbWrapper.initDB().then(response => {
    var link_manager = require('./../modules/link_manager');
    var core_schemas = require('./../models/core_schemas');
    var item_name = 'youtube6r_aaZ0FpAw'; var node_id = 'aaaabbbbcccc'; var node_name = 'something about PCA';
    var node_info = {node_name : node_name};

    link_manager.addItemLink(item_name, node_id, node_info).then(link_saved => {
        console.log(link_saved);
        return link_manager.getLinksByItem(item_name);
    }).then(item_links => {
        console.log(item_links);
        return link_manager.removeAllLinksByItem(item_name);
    }).then(links_removed => {
        console.log(links_removed);
    }).catch(err => console.log(err));

}, reject => {console.log("not connected to DB")}
);
