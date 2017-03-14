/**
 * Created by Дмитрий on 13.03.2017.
 * решил перенести работу с item-ми из sourcemanager
 */
var core_schemas = require('./../models/core_schemas');
var Item = core_schemas.Item;


/* сохранение в БД item-а с готовой структурой, предоставленной парсером */
/*TODO разработать метод сохранения item-а с произвольной структурой, не соответствующей itemSchema*/
var saveBuiltItem = function(_item) {
    return new Promise((resolve, reject) => {
        let item = new Item(_item);
        item.save(function (err) {
            if (err) {
                console.log("saveBuiltItem error: " + err);
                reject(err);
            }
            else {
                //console.log(source.name + "saved to db");
                resolve(item.name + "saved to db");
            }
        })
    })
};
module.exports.saveBuiltItem = saveBuiltItem;


/*TODO реализовать методы ниже */
var getAllItemsForSource = function(source_url) {
    return new Promise(function(resolve, reject) {
    })
};


var getItemByName = function(item_name) {
    return new Promise(function(resolve, reject) {
    })
};

var getAllItemsByName = function(item_name) {
    return new Promise(function(resolve, reject) {
    })
};


