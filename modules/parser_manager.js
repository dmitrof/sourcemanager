/**
 * Created by Дмитрий on 11.03.2017.
 */
var core_schemas = require('./../models/core_schemas');
var ParserInfo = core_schemas.Parser;

var getParserData = function(source_type, callback) {
    //TODO убрать findOne
    ParserInfo.findOne({ source_type : source_type}, function(err, doc) {
        if (err) {
            console.log("findone error");
            throw err;
        }
        else {
            console.log(doc);
        }
    });
    callback();
};
module.exports.getParserData = getParserData;

