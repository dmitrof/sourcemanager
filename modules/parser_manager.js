/**
 * Created by Дмитрий on 01.03.2017.
 */
var core_schemas = require('./../models/core_schemas');
var ParserInfo = core_schemas.Parser;

var getParserByType = function(source_type) {
    return new Promise(function(resolve, reject) {      //TODO убрать findOne
        ParserInfo.findOne({ source_type : source_type}, function(err, doc) {
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

var saveParserData = function(parser_model) {
    return new Promise(function (resolve, reject) {
        parser_model.save(function (err) {
            if (err) {
                console.log("saveParserData error: " + err);
                reject(err);
            }
            else {
                console.log(parser_model.name + "saved to db");
                resolve(parser_model);
            }

        })

    })
};

var removeParserByType = function(source_type) {
    return new Promise(function(resolve, reject) {      //TODO убрать findOne
        ParserInfo.remove({ source_type : source_type}, function(err) {
            if (err) {
                console.log("removeParserByType error");
                reject(err)
            }
            else {
                console.log(source_type.concat("removed"));
                resolve("parser for source type \"".concat(source_type).concat("\"removed"));
            }
        });
    });
};

var removeParserByField = function(key, value) {
    return new Promise(function(resolve, reject) {      //TODO убрать findOne
        ParserInfo.remove({ source_type : source_type}, function(err) {
            if (err) {
                console.log("removeParserByType error");
                reject(err)
            }
            else {
                resolve(parser_model.name + "removed");
            }
        });
    });
};



module.exports.getParserByType = getParserByType;
module.exports.removeParserByType = removeParserByType;
module.exports.removeParserByField = removeParserByField;
module.exports.saveParserData = saveParserData;

