/**
 * Created by Дмитрий on 18.12.2016.
 */

var core_schemas = require('./../models/core_schemas');
var item_manager = require('./../modules/item_manager');
var itemLinkModel = core_schemas.ItemLink;
var itemModel = core_schemas.Item;
var linkTagModel = core_schemas.LinkTag;

/* возвращает все itemLink-и для айтема */
var getLinkByItem = function(source_url) {
    return new Promise(function(resolve, reject) {
        ItemLinkModel.find({ url : source_url}, function(err, doc) {
            if (err) {
                console.log("findone error");
                reject(err)
            }
            else {

                resolve(doc);
            }
        });
    });
};