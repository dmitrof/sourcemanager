/**
 * Created by Дмитрий on 13.03.2017.
 * решил перенести работу с item-ми из sourcemanager
 */
var Item = require('./../models/item');
var FetchDocResult = require('./../modules/AsyncResult').FetchDocResult;
var ErrorResult = require('./../modules/AsyncResult').ErrorResult;

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
var getAllItemsForSource = function(_source_url) {
    return new Promise(function(resolve, reject) {
        Item.find({source_url : _source_url}, function(err, docs) {
            if (err)
                reject(new ErrorResult('db_fail', err));
            else
                resolve(new FetchDocResult('Документы для источника', 'success', docs));
        });
    })
};
module.exports.getAllItemsForSource = getAllItemsForSource;

//получает самый свежий документ по имени (уникальное для каждой серии документов)
var getItemByName = function(item_name) {
    return new Promise(function(resolve, reject) {
        Item.findOne({name : item_name}, {}, { sort : {'created_at' : -1 }}, function(err, doc) {
            if (err)
                reject(new ErrorResult('db_fail', err));
            else {
                if (doc)
                    resolve (new FetchDocResult(true, 'Получен документ', doc));
                else
                    resolve (new FetchDocResult(false, 'Документ с именем ' + item_name + ' не найден'));
            }
                //console.log(doc);
        })


    })
};
module.exports.getItemByName = getItemByName;


//получает все документы по имени (уникальное для каждой серии документов)
var getAllItemsByName = function(item_name) {
    return new Promise(function(resolve, reject) {
    })
};


