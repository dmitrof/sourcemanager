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
    for (var property in node_data) {
        if (node_data.hasOwnProperty(property))
            constr[property] = node_data[property];
    }
    var itemLink = new ItemLinkModel(constr);
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
module.exports.removeAllLinksByItem = removeAllLinksByItem;