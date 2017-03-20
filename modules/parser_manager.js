/**
 * Created by Дмитрий on 01.03.2017.
 */

var Parser = require('./../models/parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateResult = require('./../modules/AsyncResult').CreateResult;
var FetchDocResult = require('./../modules/AsyncResult').FetchDocResult;


var getParsers = async function() {
    var docs = await Parser.find({}).exec();
    if (docs) {
        return new FetchDocResult(true, 'Документы получены', docs);
    }
    else {
        return new FetchDocResult(false, 'Документы не найден', docs);
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
    if (result) {
        return new CreateResult(false, "Уже есть парсер с именем ".concat(data.name));
    }
    var parser = new Parser(data);
    var save_result = await parser.save();
    return new CreateResult(true, "Сохранен ".concat(data.name));
}
module.exports.createParser = createParser;
/*var getParserByName = async function(_name) {
    return await(Parser.loadByName(_name));
};
module.exports.getParserByName = getParserByName;*/

var deleteParser = function(parser_id) {
    return Parser.remove({_id : parser_id}).exec();
};
module.exports.deleteParser = deleteParser;



