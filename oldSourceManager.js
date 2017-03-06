/**
 * Created by Дмитрий on 12.12.2016.
 */
/**
 * Created by Дмитрий on 22.11.2016.
 */

dbHelper = require('./dbHelper');
db = dbHelper.db;
itemProvider = dbHelper.itemProvider;
db.collection('quotes');

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
        getParser(source_url, source_type, function(err, _parser) {
            if (err) {
                console.log(err);
                reject(err)
            }
            else {
                parser = _parser;
                resolve('source is validated')
            }

        });
    });

    promises.push(getParserPromise);

    getParserPromise.then(function(){
        db_promise = new Promise(function(resolve, reject) {
            saveSource(source_url, source_type, function(err, ok) {
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
                callback(null, 'Source is added!');

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

var addAndParseSource = function() {};
//validate URL and source type here, get parser
getParser = function(source_url, source_type, callback) {
    console.log("getParser".concat(source_type).concat(source_url));
    var parser;
    if (source_type != null) {  //get parser from source_type
        parserType = sources_types[source_type];
        if (parserType == undefined) {
            callback('source type is not valid');
        }
        console.log("parserType: ".concat(parserType));
        var domain_list = sources_urls[parserType];
        console.log("urls_list: ".concat(domain_list));
        //доделать ДОМЕН
        source_domain = getUrlDomain(source_url);
        if (domain_list.indexOf(source_domain) != -1) {
            parser = parserType;

            callback(null, parser);
        }
        else {callback('source URL is not valid');}


    }
    else {}
};
//parse start parsing source's contents. Delegates logic to specific parser (for exmple jishoParser)
parseSource = function(source_url, _parser, callback) {
    var parser = require('./youtube_parser');
    parser.parseDefault(source_url, function(err, ok) {
        console.log("PARSEDPARSEDPARSEDPARSEDPARSEDPARSED");
    });
};
saveSource = function(source_url, source_type, callback) {
    source = {};
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
    });
};
validateUrl = function(source_url,callback) {

};
getUrlDomain = function(source_url, callback) {
    //return source_url;
    return 'www.youtube.com';
};


