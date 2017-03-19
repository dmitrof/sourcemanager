/**
 * Created by Дмитрий on 01.03.2017.
 */

var Parser = require('./../models/parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CreateResult = require('./../modules/AsyncResult').CreateResult;


var getParsers = function(_id) {
    return Parser.find({}).exec();
};
module.exports.getParsers = getParsers;

var getParser = function(parser_id) {
    return Parser.findOne({_id: Schema.Types.ObjectId(parser_id)}).exec();
};
module.exports.getParser = getParser;
var getParserByName = function(parser_name) {
    return Parser.findOne({name : parser_name}).exec();
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



