/**
 * Created by Дмитрий on 22.11.2016.
 */

dbHelper = require('./db_wrapper');
db = dbHelper.db;
itemProvider = dbHelper.itemProvider;
db.collection('quotes');


var parser_manager = require('./../modules/parser_manager');
var core_schemas = require('./../models/core_schemas');
var Source = core_schemas.Source;
var SourceType = core_schemas.SourceType;
var ParserInfo = core_schemas.Parser;


module.exports.setDB = function(_db) {
    db = _db;
};
sources_types = require('./../config/source_types');
sources_urls = require('./../config/source_domain');

    //adding source to database. URL validation required
var addSource = function(source_url, source_type, source_info) {
    var promises = [];
    var parser;

};

module.exports.addSource = addSource;

//parse start parsing source's contents. Delegates logic to specific parser (for exmple jishoParser)
parseSource = function(source_url, _parser, callback) {
    var parser = require('./youtube_parser');
    parser.parseDefault(source_url, function(err, ok) {
        console.log("PARSEDPARSEDPARSEDPARSEDPARSEDPARSED");
    });
};
/*
Производится запись основных данных об источнике
 */
var saveSource = function(source_info) {
    return new Promise(function (resolve, reject) {
        var source = new Source({
            url : source_info.url,
            type : source_info.type
            //added_by_user : getUserFromSession
        });
        source.save(function (err) {
            if (err) {
                console.log("saveSource error: " + err);
                reject(err);
            }
            else {
                console.log(source.name + "saved to db");
                resolve(source.name + "saved to db");
            }
        })
    })
};
module.exports.saveSource = saveSource;


validateUrl = function(source_url,callback) {   //TODO а надо ли вообще?

};
getUrlDomain = function(source_url, callback) { //TODO а надо ли вообще?
    //return source_url;
    return 'www.youtube.com';
};


