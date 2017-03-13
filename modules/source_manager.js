/**
 * Created by Дмитрий on 22.11.2016.
 */
var parser_manager = require('./../modules/parser_manager');
var item_manager = require('./../modules/item_manager');
var core_schemas = require('./../models/core_schemas');
var Source = core_schemas.Source;
var SourceType = core_schemas.SourceType;
var ParserInfo = core_schemas.Parser;
var Item = core_schemas.Item;


module.exports.setDB = function(_db) {
    db = _db;
};
sources_types = require('./../config/source_types');
sources_urls = require('./../config/source_domain');

    //adding source to database. URL validation required
var addSource = function(source_url, source_type, source_info) {
    return new Promise(function(resolve, reject) {
        var promises = [];
        fetchSourceMetadata(source_url).then(metadata => {
                return {
                    url: source_url,
                    type: source_type,
                    metadata: metadata
                };
            },
            reject => {
                console.log("failed to fetch metadata:".concat(reject));
                return {
                    url: source_url,
                    source_type: source_type
                };
            }
        ).then(source_info => {
            return saveSource(source_info)
        }).then(saveSuccess => {
            console.log(saveSuccess);
            resolve(saveSuccess);
        }).catch(err => reject(err));
    });


};

module.exports.addSource = addSource;

//parse start parsing source's contents. Delegates logic to specific parser (for exmple jishoParser)
parseSource = function(source_url, _parser, callback) {
    var parser = require('./youtube_fetcher');
    parser.parseDefault(source_url, function(err, ok) {
        console.log("PARSEDPARSEDPARSEDPARSEDPARSEDPARSED");
    });
};


/* Запрос к локальному парсеру */
var parseSource = function(source_url) {
    parser_manager.getParserByType(source_type)
        .then(parserInfo => {
            var parser = require('../../'.concat(parserInfo.name));
        })
};

/* запрос к локальноу или удаленному парсеру */
var parseRequest = function(source_url, parserInfo) {
    return new Promise(function(resolve, reject) {

    })
};




/*
некая абстрактная асинхронная операция извлечения метаданных источника,
пока непонятно где и как ее использовать. Например, на сайте могут храниться данные об источнике, которые необходимо парсить.
 */
var fetchSourceMetadata = function(source_url) {
    return new Promise(function (resolve, reject) {
        resolve("Kostylnaya metadata");
    })
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
                //console.log(source.name + "saved to db");
                resolve(source.name + "saved to db");
            }
        })
    })
};
module.exports.saveSource = saveSource;



var getSourceByUrl = function(source_url) {
    return new Promise(function(resolve, reject) {
        Source.findOne({ url : source_url}, function(err, doc) {
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
module.exports.getSourceByUrl = getSourceByUrl;

var removeSourceByUrl = function(source_url) {
    return new Promise(function(resolve, reject) {
        Source.remove({ url : source_url}, function(err) {
            if (err) {
                resolve("could not remove source  \"".concat(source_url));
                reject(err)
            }
            else {
                resolve("source  \"".concat(source_url).concat("\" removed"));
            }
        });
    });
};

module.exports.removeSourceByUrl = removeSourceByUrl;


validateUrl = function(source_url,callback) {   //TODO а надо ли вообще?

};
getUrlDomain = function(source_url, callback) { //TODO а надо ли вообще?
    //return source_url;
    return 'www.youtube.com';
};


