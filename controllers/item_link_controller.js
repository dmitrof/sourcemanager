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

var getNodes2 = async function(req, res, next) {
    var resultPromise = new Promise((resolve, reject) =>
    {
        var result = ontology_provider.requestOntology('sup');
        if (result.success)
            resolve(result)
        else
            reject(result)
    }).then(result => {
        res.render('item_ontology', {status : result.message, ontology : result.data});
    }).catch(result => {
        res.redirect('/sources?status='.concat(result.message));
    })
};

var getOntology = async function(req, res) {
    var result = await ontology_provider.requestOntology(req.params.domain_uri);
    res.json(result.data);
};

module.exports.getOntology = getOntology;

var getNodesAndItem = async function(req, res, next) {
    var result = await ontology_provider.requestOntology('sup');
    var item = {name : req.query.item_name, title : req.query.item_title};
    var status = req.query.status;
    //parseOntologyNode(result.data);
    res.render('item_ontology', {ontology_status : result.message, ontology : result.data, item : item, status : status});
};
module.exports.getNodesAndItem = getNodesAndItem;

module.exports.addLinkForItem = async function(req, res, next) {
    if ((!req.body.unique_link) || (req.body.unique_link === undefined))
        var result = await link_manager.addItemLink(req.body.item_name, req.body.node_id,
            {node_description : req.body.node_description, node_name : req.body.node_name});
    else
        var result = await link_manager.addUniqueItemLink(req.body.item_name, req.body.node_id, {description : req.body.node_description});
    res.redirect('/get_item/get_ontology?status=' + result.message + "&item_name=" + req.body.item_name + "&item_title=" + req.body.item_title);
    //parseOntologyNode(result.data);
};

module.exports.deleteItemLink = async function(req, res, next) {
    try {
        var result = await link_manager.removeItemLink(req.body.item_link_id);
        res.redirect('/get_item?status=' + result.message + '&item_name=' + req.body.item_name);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

};

module.exports.getAllTags = async function(req, res, next) {
    console.log('requested list of tags');
    try {
        var result = await link_manager.getAllTags();
        res.render('tags', {tags : result.data, status : result.message})
    }
    catch (err) {
        console.log(err); res.status(500).send(err);
    }
};

module.exports.createTag = async function(req, res, next) {
    console.log('requested tag addition');
    var tag_data = {text : req.body.tag_text, description : req.body.description,
                nodes : []};
    try {
        var save_result = await link_manager.createTag(tag_data);
        res.redirect('/tags?status=' + save_result.message);
    }
    catch (err) {
        console.log(err); res.status(500).send(err);
    }
};

module.exports.deleteTag = async function(req, res, next) {
    try {
        console.log('requested tag deletion');
        var result = await link_manager.deleteTag(req.body.tag_id);
        res.redirect('/tags?status=' + result.message);
    }
    catch (err) {
        console.log(err); res.status(500).send(err);
    }
}

module.exports.getTagAndOntology =  async function(req, res, next) {
    try {
        var tag_text = req.query.tag_text;
        console.log(tag_text);
        var tag_result = await link_manager.getTagByText(tag_text);
        if (!tag_result.success)
            res.redirect('/tags?status' + tag_result.message);
        else
            res.render('tag_info', {status : tag_result.message, tag : tag_result.data});
    }
    catch (err) {
        console.log(err); res.status(500).send(err);
    }
}

module.exports.addTagToItem = async function(req, res, next) {
    try {
        console.log('requested add tag');
        var result = await link_manager.addTagToItem(req.body.item_name, req.body.tag_text);
        res.redirect('/get_item?status=' + result.message + '&item_name=' + req.body.item_name);
    }
    catch (err) {
        console.log(err); res.status(500).send(err);
    }
}