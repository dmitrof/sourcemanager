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
var addSource = function(source_url, source_type, callback) {
    var promises = [];
    var parser;
    getParserPromise = new Promise(function(resolve, reject) {
        parser_manager.getParserData(source_type, function(err, _parser) {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                parser = _parser;
                resolve(parser)
            }

        });
    });
    promises.push(getParserPromise);
    getParserPromise.then(function(){
        db_promise = new Promise(function(resolve, reject) {
            source = {}; source.source_url = source_url;
            source.source_type = source_type;
            
            saveSource(source, function(err, ok) {
                if (err) {
                    console.log(err);
                    reject(err)
                }
                else {
                    console.log(ok);
                    resolve('source is saved')
                }
                });
            });
            db_promise.then(function(value) {
                parseSource(source_url, parser);
                callback(null, value);

            },
            function(reason) {

                callback(reason);
            });
            promises.push(db_promise);
        }, function(reason){
            callback(reason);
        });

        /*Promise.all(promises).then(function() {
            callback(null, 'Source is added!');
        });*/





    };

module.exports.addSource = addSource;





//parse start parsing source's contents. Delegates logic to specific parser (for exmple jishoParser)
parseSource = function(source_url, _parser, callback) {
    var parser = require('./youtube_parser');
    parser.parseDefault(source_url, function(err, ok) {
        console.log("PARSEDPARSEDPARSEDPARSEDPARSEDPARSED");
    });
};
saveSource = function(_source, callback) {
    var source = new Source({
        source_url : _source.source_url,
        source_type : _source.source_type,
        //и так далее
    });
    source.save(function(err) {
        if (err)
            throw err;
        callback(null, 'source is saved');
    });
    /*source = {};
    source.source_url = source_url;
    source.type = source_type;
    dbHelper.saveSource(source, function(err, ok) {
        if (err) {
            console.log(err);
            callback(err)
        }
        else {
            //console.log(ok);
            callback(null, 'source saved');
        }
    });*/
};
validateUrl = function(source_url,callback) {

};
getUrlDomain = function(source_url, callback) {
    //return source_url;
    return 'www.youtube.com';
};


