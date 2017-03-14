/**
 * Created by Дмитрий on 18.12.2016.
 */

var core_schemas = require('./../models/core_schemas');
var item_manager = require('./../modules/item_manager');
var ItemLinkModel = core_schemas.ItemLink;
var ItemModel = core_schemas.Item;
var LinkTagModel = core_schemas.LinkTag;

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
    itemLink.attachMetadata(metadata)
    return new Promise(function (resolve, reject) {
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
var addLinkByTag = function() {

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