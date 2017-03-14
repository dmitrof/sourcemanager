/**
 * Created by Дмитрий on 18.12.2016.
 */

var core_schemas = require('./../models/core_schemas');
var item_manager = require('./../modules/item_manager');
var ItemLinkModel = core_schemas.ItemLink;
var ItemModel = core_schemas.Item;
var LinkTagModel = core_schemas.LinkTag;
var ontology_provider = require('./../modules/ontology_provider');


var getAllLinks = function() {
    return new Promise(function(resolve, reject) {
        ItemLinkModel.find([
            { $match : {state : 'active'}},
            { $group : {_id : 'item_name'}}
        ], function(err, docs) {
            if (err) {
                console.log("findone error");
                reject(err)
            }
            else {
                //console.log(docs);
                resolve(docs);
            }
        });
    });
};
/* возвращает все itemLink-и для айтема */
var getLinksByItem = function(_item_name) {
    return new Promise(function(resolve, reject) {
        ItemLinkModel.find({ item_name : _item_name}, function(err, docs) {
            if (err) {
                console.log("findone error");
                reject(err)
            }
            else {
                //console.log(docs);
                resolve(docs);
            }
        });
    });
};
module.exports.getLinksByItem = getLinksByItem;


/*Добавляет itemLink в базу */
var addItemLink = function(_item_name, node_id, node_data) {
    return new Promise(function (resolve, reject) {
        var constr = { item_name : _item_name, node_id : node_id};
        if (node_data.hasOwnProperty('node_name'))
            constr.node_name = node_data.node_name;
        if (node_data.hasOwnProperty('node_description'))
            constr.node_description = node_data.node_description;
        var metadata = {};
        for (var property in node_data) {
            if (node_data.hasOwnProperty(property))
                metadata[property] = node_data[property];
        }
        var itemLink = new ItemLinkModel(constr);
        itemLink.attachMetadata(metadata);
        itemLink.save(function (err) {
            if (err) {
                console.log("addItemLink error: " + err);
                reject(err);
            }
            else {
                //console.log("itemLink for " + itemLink.item_name + "saved to db");
                resolve("itemLink for " + itemLink.item_name + " saved to db");
            }

        })
    })
};
module.exports.addItemLink = addItemLink;
/* удаляет вся связи для выбранного item-а */
var removeAllLinksByItem = function(_item_name) {
    return new Promise(function(resolve, reject) {
        ItemLinkModel.remove({ item_name : _item_name}, function(err) {
            if (err) {
                console.log("removeAllLinksByItem error");
                reject(err)
            }
            else {
                console.log("Item_links for".concat(_item_name).concat("removed"));
                resolve("Item_links for".concat(_item_name).concat("removed"));
            }
        });
    });
};

/* связывание по тегам. В рамках этой процедуры производится запрос к модулю онтологии*/
var addLinksByTag = function(item_name, tag_text, data) {
    return new Promise((resolve, reject) => {
        getTagByText(tag_text).then(tag_data => {
            let node_ids = [];
            tag_data.nodes.forEach(function(node, i) {
                console.log(node);
                node_ids.push(node);
            });
            console.log(node_ids);
            ontology_provider.requestNodesData(node_ids).then(ontology_response => {
                console.log('Response status from ontology_service: '.concat(ontology_response.status));
                let nodes = ontology_response.nodes;
                nodes.forEach(function(node, i, nodes) {
                    console.log('adding link for node '.concat(node.node_id));
                    addItemLink(item_name, node.node_id, node).then(success => console.log(success)).catch(err => console.log(err));
                });
                resolve('all itemLinks for tag '.concat(tag_text).concat(' are processed'));
            }).catch(err => reject(err));

        }, failure => reject(failure))
    });

};
module.exports.addLinksByTag = addLinksByTag;

var getTagByText = function(tag_text) {
    return new Promise(function(resolve, reject) {
        LinkTagModel.findOne({ text : tag_text}, function(err, doc) {
            if (err) {
                console.log("findone error");
                reject(err)
            }
            else {
                //console.log(doc);
                resolve(doc);
            }
        });
    });
};

var addTag = function(tag_text, tag_data) {
    var tagconstr = {text : tag_text}; var node_list = [];
    if (tag_data.hasOwnProperty('nodes'))
        node_list = tag_data.nodes;
    var metadata = {};
    for (var property in tag_data) {
        if (tag_data.hasOwnProperty(property))
            metadata[property] = tag_data[property];
    }
    var tag = new LinkTagModel({text : tag_text, nodes : node_list});
    tag.attachMetadata(metadata);
    return new Promise(function(resolve, reject) {
        tag.save(function (err) {
            if (err) {
                console.log("tagSave error: " + err);
                reject(err);
            }
            else {
                //console.log("itemLink for " + itemLink.item_name + "saved to db");
                resolve("tag " + tag_text + " saved to db");
            }

        })
    });
};

var removeTagByText = function(tag_text) {
    return new Promise(function(resolve, reject) {
        LinkTagModel.remove({ text : tag_text}, function(err) {
            if (err) {
                console.log("removeTagByText error");
                reject(err)
            }
            else {
                //console.log("Item_links for".concat(_item_name).concat("removed"));
                resolve("tag " + tag_text + " removed from db");
            }
        });
    });
};
module.exports.removeTagByText = removeTagByText;
module.exports.addTag = addTag;
module.exports.removeAllLinksByItem = removeAllLinksByItem;