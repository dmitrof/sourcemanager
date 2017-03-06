/**
 * Created by Дмитрий on 12.12.2016.
 */
/**
 * Created by Дмитрий on 20.11.2016.
 */
const MongoClient = require('mongodb').MongoClient;




var dbCallback = function(err, ok) {
    if (err) {
        console.log(err);
    }
    if (ok) {
        console.log(ok);
    }

};

module.exports.initDB = function(callback) {
    MongoClient.connect("mongodb://localhost:27017/exampleDb", function (err, database) {
        if (!err) {
            console.log("We are cconnected");
            var db = database;
            module.exports.db = db;
            var promises = [];
            promises.push(new Promise(function(resolve, reject) {

                //db.collection('sources').dropIndex("source_url");
                db.collection('sources').createIndex('source_url', {unique : true}, function(err, ok) {
                    if (err) {console.log(err); reject(err);}
                    else {console.log(ok); resolve('ok');}
                });
            }));
            promises.push(new Promise(function(resolve, reject) {
                //убрать потом
                //db.collection('items').dropIndex("item_id");
                //
                db.collection('items').createIndex("item_id", {unique : true}, function(err, ok) {
                    if (err) {console.log(err); reject(err);}
                    else {console.log(ok); resolve('ok'); }
                });
            }));
            Promise.all(promises).then(function(value) {
                    console.log(value);
                    callback(null, value);
                },
                function(reason) {
                    console.log(reason);
                    callback(reason);
                });


        }
        else {
            callback(err);
        }
    });
};



//класс для работы с "абстрактными" документами в БД
ItemProvider = {
    saveDoc : function(item, _collection, callback) {
        //db.createCollection('quotes', {w:1}, function(err, collection) {});
        var collection = db.collection(_collection);
        collection.update({item_id: item.item_id} ,item, {upsert : true},function(err, ok) {
            if (err) {
                console.log(err);
                callback(err);
            }
            else {
                //console.log(item.item_id + ' saved to db');
                ok = item.item_id + ' saved to db';
                callback(null, ok)
            }
        });
    },
};



module.exports.saveSource = function(source, callback, argv) {
    //db.createCollection('quotes', {w:1}, function(err, collection) {});
    var collection = db.collection('sources');
    //далее идет доформирование объекта source (Schema)
    //try {
    collection.update({source_url : source.source_url}, source, {upsert : true}, function(err, ok) {
        if (err) {
            console.log(err);
            callback(err);
        }
        else {
            console.log('saved to db');
            callback(null, ok)
        }
    });
    /*}
     catch(e) {
     console.log(e);
     }*/

};


module.exports.itemProvider = ItemProvider;