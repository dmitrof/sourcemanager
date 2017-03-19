/**
 * Created by Дмитрий on 22.11.2016.
 */
var parser_manager = require('./../modules/parser_manager');
var item_manager = require('./../modules/item_manager');
var mongoose = require('mongoose');
var SourceType = require('./../models/sourcetype');
var ParserInfo = require('./../models/parser');

var FetchDocResult = require('./../modules/AsyncResult').FetchDocResult;
var ErrorResult = require('./../modules/AsyncResult').ErrorResult;

var Item = require('./../models/item');
var Source = require('./../models/source');

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
var addSource = function(source_data) {
    return new Promise(function(resolve, reject) {
        fetchSourceMetadata(source_data.url).then(metadata => {
                let source_info = {
                    url: source_data.url,
                    type: source_data.type,
                    name: source_data.name,
                    description : source_data.description,
                    metadata : metadata
                };
                return source_info;
            },
            reject => {
                console.log("failed to fetch metadata:".concat(reject));
                return source_info;
                let source_info = {
                    url: source_data.url,
                    type: source_data.type,
                    name: source_data.name,
                    description : source_data.description,
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
var addAndParseSource = function(source_data) {
    return new Promise((resolve, reject) => {
        addSource(source_data).then(
            source_added => {
                console.log("Source " + source_data.url + " parsing has started");
                parseSource(source_data.url, source_data.type).then(parserResponse => {
                    console.log("Source " + source_data.url + " parsing has finished");
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
                reject(new ErrorResult('db_fail', err));
            }
            else {
                if (!doc) reject(new FetchDocResult('Не найден источник с URL: '.concat(source_url), 'not_found', doc));
                resolve(new FetchDocResult('Получен документ', 'db_success', doc));
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

module.exports.getSourceTypes = function() {
    return SourceType.find({}).exec();
};






