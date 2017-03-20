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
    var item = {name : req.query.item_name, title : req.query.item_title}
    res.render('item_ontology', {ontology_status : result.message, ontology : result.data, item : item});

};

module.exports.getNodesAndItem = getNodesAndItem;