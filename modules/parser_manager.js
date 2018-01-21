/**
 * Created by Дмитрий on 01.03.2017.
 */

var Parser = require('./../models/parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateResult = require('./../modules/AsyncResult').CreateResult;
var FetchDocResult = require('./../modules/AsyncResult').FetchDocResult;
var SourceType = require('./../models/sourcetype');


var getParsers = async function() {
    var docs = await Parser.find({}).exec();
    if (docs.length > 0) {
        console.log(docs);
        return new FetchDocResult(true, 'Парсеры получены', docs);
    }
    else {
        return new FetchDocResult(false, 'Нет доступных парсеров', docs);
    }
};
module.exports.getParsers = getParsers;

var getParser = function(parser_id) {
    return Parser.findOne({_id: Schema.Types.ObjectId(parser_id)}).exec();
};
module.exports.getParser = getParser;
var getParserByName = async function(parser_name) {
    var doc = await Parser.findOne({name : parser_name}).exec();
    if (!doc)
        return new FetchDocResult(false, 'Документ не найден');
    else
        return new FetchDocResult(false, 'Документ найден', doc);
};
module.exports.getParserByName = getParserByName;

async function createParser(data) {
    var result = await getParserByName(data.name);
    if (result.success) {
        return new CreateResult(false, "Уже есть парсер с именем ".concat(data.name));
    }
    var parser = new Parser(data);
    var save_result = await parser.save();
    return new CreateResult(true, "Сохранен ".concat(data.name));
}
module.exports.createParser = createParser;

var getParserByType = async function(source_type) {
    var source_type = await SourceType.findOne({type : source_type}).exec();
    console.log(source_type.parser);
    if (!source_type) {
        return new Promise((resolve, reject) => {
            reject(new FetchDocResult(false, 'nonexistent source type',null ));
        });
    }
    else {
        let parser = await getParserByName(source_type.parser);
        if (!parser)
            return new Promise((resolve, reject) => {
                reject(new FetchDocResult(false, 'parser' + source_type.parser +' does not exist', null ));

            });
        else
            return new Promise((resolve, reject) => {
                resolve(new FetchDocResult(true, 'Parser is fetched', parser.data));
            });
    }
};
module.exports.getParserByType = getParserByType;

var deleteParser = function(parser_id) {
    return Parser.remove({_id : parser_id}).exec();
};
module.exports.deleteParser = deleteParser;



