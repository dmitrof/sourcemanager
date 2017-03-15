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



sources_types = require('./../config/source_types');
sources_urls = require('./../config/source_domain');

/* возвращает список источников */
var getFilteredSources = function(filter_data) {     /*TODO написать обработку filter_data, когда появится GUI */

    return new Promise(function(resolve, reject) {
        if (filter_data) {reject('filter feature is not developed yet'); return;}
        var sources = [];
        Source.find({}, function(err, docs) {
            if (err) reject(err);
            else {
                if (Array.isArray(docs))
                    resolve(docs);
                else {
                    sources.push(docs);
                    resolve(sources);
                }
            }
        })

    });
};
module.exports.getSources = getFilteredSources;

    //adding source to database. URL validation required
var addSource = function(source_url, source_type, source_info) {
    return new Promise(function(resolve, reject) {
        var promises = [];
        fetchSourceMetadata(source_url).then(metadata => {
                let source_info = {
                    url: source_url,
                    type: source_type,
                    metadata : metadata
                };
                return source_info;
            },
            reject => {
                console.log("failed to fetch metadata:".concat(reject));
                return source_info;
                let source_info = {
                    url: source_url,
                    type: source_type,
                    metadata : metadata
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


/* добавляет ресурс, после чего вызывает его парсинг */
var addAndParseSource = function(source_url, source_type, info) {
    return new Promise((resolve, reject) => {
        addSource(source_url, source_type, info).then(
            source_added => {
                console.log("Source " + source_url + " parsing has started");
                parseSource(source_url, source_type).then(parserResponse => {
                    console.log("Source " + source_url + " parsing has finished");
                    saveItems(parserResponse);
                },
                    parser_rejected => console.log("parser rejected ".concat(reject))
                ).then(saveSuccess => console.log(saveSuccess));
                resolve(source_added);
            }
        ).catch(err => {
            reject(err)
        });
    })
};
module.exports.addAndParseSource = addAndParseSource;

/* wrapper запроса к парсеру. Возвращает промис с ответом от парсера*/
var parseSource = function(source_url, source_type) {

    return new Promise((resolve, reject) => {
        parser_manager.getParserByType(source_type)
            .then(parserInfo => {
                if (parserInfo.standalone) {

                    return parseRequest(source_url, parserInfo);
                }
                else {

                    var parser = require('./../modules/'.concat(parserInfo.name));
                    return parser.fetchAllItems(source_url);
                }
            }, db_rejected => console.log("parser_manager error " + db_rejected)
            ).then(parserResponse => {
                console.log("source " + source_url + " is parsed");
                resolve(parserResponse);
            }, parser_rejected => {
            console.log("parser_rejected: " + parser_rejected);
        }).catch(err => reject(err));
    });

};
module.exports.ParseSource = parseSource;

/* вызывает resolve в том случае, когда все итемы сохранены в базу */



/* запрос к локальноу или удаленному парсеру */
var parseRequest = function(source_url, parserInfo) {
    return new Promise(function(resolve, reject) {

    })
};

var saveItems = function(parserResponse) {
    //console.log(parserResponse.items);
    return new Promise((resolve, reject) => {
        parserResponse.items.forEach(item_manager.saveBuiltItem);
        resolve("saved");
    });
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
        if (source_info.hasOwnProperty('metadata')) source.attachMetadata(source_info.metadata);
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
                if (!doc) reject('source not found ' + source_url);
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




