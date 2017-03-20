/**
 * Created by Дмитрий on 19.03.2017.
 */
var link_manager = require('./../modules/link_manager');
var item_manager = require('./../modules/item_manager');
var ontology_provider = require('./../modules/ontology_provider');

var getNodes = async function(req, res, next) {
    var result = await ontology_provider.requestOntology('sup');
    console.log(result.data);
    if (!result.success)  {
        res.redirect('/sources?status='.concat(result.message));
    }
    else {
        res.render('item_ontology', {status : result.message, ontology : result.data});
    }

};
module.exports.getNodes = getNodes;


var getNodesAndItem = async function(req, res, next) {
    var result = await ontology_provider.requestOntology('sup');
    var item = {name : req.query.item_name, title : req.query.item_title};
    var status = req.query.status;
    //parseOntologyNode(result.data);
    res.render('item_ontology', {ontology_status : result.message, ontology : result.data, item : item, status : status});
};
module.exports.getNodesAndItem = getNodesAndItem;

module.exports.addLinkForItem = async function(req, res, next) {
    var result = await link_manager.addItemLink(req.body.item_name, req.body.node_id, {description : req.body.node_description});
    res.redirect('/get_item/get_ontology?status='.concat(result.message));
    //parseOntologyNode(result.data);
};