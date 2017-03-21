/**
 * Created by Дмитрий on 18.12.2016.
 */
var item_manager = require('./../modules/item_manager');
var ItemLink = require('./../models/itemlink');
var ItemModel = require('./../models/item');
var Tag = require('./../models/linktag');
var ontology_provider = require('./../modules/ontology_provider');
var FetchDocResult = require('./../modules/AsyncResult').FetchDocResult;
var ErrorResult = require('./../modules/AsyncResult').ErrorResult;
var CreateResult = require('./../modules/AsyncResult').CreateResult;


var getAllLinks = function() {
    return new Promise(function(resolve, reject) {
        ItemLink.find([
            { $match : {state : 'active'}},
            { $group : {_id : 'item_name'}}
        ], function(err, docs) {
            if (err) {
                console.log("findone error");
                reject(new ErrorResult('db_fail', err));
            }
            else {
                //console.log(docs);
                resolve(docs);
            }
        });
    });
};

var addUniqueItemLink = async function(_item_name, _node_id, node_data) {
    var result = await ItemLink.getItemNodeLinks(_item_name, _node_id);
    console.log(result);
    if (result.length <= 0) {
        return addItemLink(_item_name, _node_id, node_data);
    }
    else {
        return new CreateResult(false, 'Связь между контентом \"' + _item_name + '\" и дидактической единицей ' + _node_id + ' уже существует',  null);
    }
};
module.exports.addUniqueItemLink = addUniqueItemLink;

/* возвращает все itemLink-и для айтема */
var getLinksByItem = function(_item_name) {
    return new Promise(function(resolve, reject) {
        ItemLink.find({ item_name : _item_name}, function(err, docs) {
            if (err) {
                console.log("findone error");
                reject(new ErrorResult('db_fail', err));
            }
            else {
                //console.log(docs);
                resolve(new FetchDocResult(true, 'success', docs));
            }
        });
    });
};
module.exports.getLinksByItem = getLinksByItem;


/*Добавляет itemLink в базу */
var addItemLink = function(_item_name, node_id, node_data) {
    return new Promise(function (resolve, reject) {

        var constr = { item_name : _item_name, node_id : node_id};
        constr.node_name = node_data.node_name;
        constr.node_description = node_data.node_description;
        var metadata = {};
        for (var property in node_data) {
            if (node_data.hasOwnProperty(property))
                metadata[property] = node_data[property];
        }
        console.log(constr);
        var itemLink = new ItemLink(constr);
        itemLink.attachMetadata(metadata);
        itemLink.save(function (err) {
            if (err) {
                reject(new ErrorResult("addItemLink error: ", err));
            }
            else {
                //console.log("itemLink for " + itemLink.item_name + "saved to db");
                resolve(new CreateResult(true, 'Связь добавлена', null));
            }

        })
    })
};
module.exports.addItemLink = addItemLink;
/* удаляет вся связи для выбранного item-а */
var removeAllLinksByItem = function(_item_name) {
    return new Promise(function(resolve, reject) {
        ItemLink.remove({ item_name : _item_name}, function(err) {
            if (err) {
                console.log("removeAllLinksByItem error");
                reject(new ErrorResult('removeAllLinksByItem error', err));
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
            }).catch(err => reject(new ErrorResult('addLinksByTag error', err)));

        }, failure => reject(failure))
    });

};
module.exports.addLinksByTag = addLinksByTag;


module.exports.removeItemLink = async function(_id) {
    var result = await ItemLink.remove({_id : _id});
    return new CreateResult(true, 'Связь удалена', null);
};

var getTagByText = function(tag_text) {
    return new Promise(function(resolve, reject) {
        Tag.findOne({ text : tag_text}, function(err, doc) {
            if (err) {
                console.log("findone error");
                reject(err)
            }
            else {
                //console.log(data);
                if (!doc)
                    resolve(new FetchDocResult(false, 'Тег не найден', {}));
                else
                    return new FetchDocResult(false, 'Тег найден', doc);

            }
        });
    });
};
module.exports.getTagByText = getTagByText;

var getAllTags = async function() {
    var result = await Tag.find({}).exec();
    if (result.length > 0)
        return new FetchDocResult(true, 'Получен список тегов', result);
    else
        return new FetchDocResult(false, 'Теги не найдены', []);
};
module.exports.getAllTags = getAllTags;

var addTag = function(tag_data) {
    var tagconstr = {text : tag_data.text, description : tag_data.description};
    /*var node_list = [];
    if (tag_data.hasOwnProperty('nodes'))
        node_list = tag_data.nodes;
    var metadata = {};
    for (var property in tag_data) {
        if (tag_data.hasOwnProperty(property))
            metadata[property] = tag_data[property];
    }*/
    var tag = new Tag(tag_data);
   // tag.attachMetadata(metadata);
    console.log(tag);
    return new Promise(function(resolve, reject) {
        tag.save(function (err) {
            if (err) {
                console.log("tagSave error: " + err);
                reject(err);
            }
            else {
                //console.log("itemLink for " + itemLink.item_name + "saved to db");
                resolve(new CreateResult(true, 'Тэг добавлен', null));
            }

        })
    });
};

module.exports.createTag = addTag;


var removeTagByText = function(tag_text) {
    return new Promise(function(resolve, reject) {
        Tag.remove({ text : tag_text}, function(err) {
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

module.exports.deleteTag = async function(tag_id) {
    var result = await Tag.remove({_id : tag_id});
    return new CreateResult(true, 'Тег удален', null);
};
module.exports.deleteTagByText = async function(tag_text) {
    var result = await Tag.remove({text : tag_text});
    return new CreateResult(true, 'Тег удален', null);
};

var getTag = async function(tag_id) {
    var result = await Tag.findOne({text : tag_id}).exec();
    if (!result)
        return new FetchDocResult(false, 'Тег не найден', {});
    else
        return new FetchDocResult(false, 'Тег найден', result);
};
module.exports.getTag = getTag;

var addTagToItem = async function(item_name, tag_text) {
    var itemResult = await item_manager.getItemByName(item_name);
    var item = itemResult.data;
    item.tags.push(tag_text);
    var save_result = await item_manager.saveBuiltItem(item);
    console.log(save_result);
    return new CreateResult(true, 'Тег ' + tag_text + ' прикреплен');
};
module.exports.addTagToItem = addTagToItem;

module.exports.removeTagByText = removeTagByText;
module.exports.addTag = addTag;
module.exports.removeAllLinksByItem = removeAllLinksByItem;