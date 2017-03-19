/**
 * Created by Дмитрий on 19.03.2017.
 */


var source_manager = require('./../modules/source_manager');
var parser_manager  = require('./../modules/parser_manager');


module.exports.getParsers = async function(req, res, next) {
    console.log('requesting parsers');
    var status = "";
    if (req.query.status)
        status = req.query.status;
    try {
        var result = await parser_manager.getParsers();
        //console.log(result);
        res.render('parsers', {status : status, parser_list : result});
    }
    catch (err){
        console.log(err);
        res.status(500).send(err);
    }
};
module.exports.createParser = async function(req, res, next) {
    console.log('requesting create parser');
    var parser_data = {name : req.body.name, description : req.body.description}
    parser_data.saves_attachments = !!req.body.saves_attachments;
    parser_data.standalone = !!req.body.standalone;
    console.log(parser_data);
    try {
        var result = await parser_manager.createParser(parser_data);
        //console.log(result);
        res.redirect('/parsers?status='.concat(result.message));
    }
    catch (err){
        console.log(err);
        res.status(500).send(err);
    }
};

module.exports.deleteParser = async function(req, res, next) {
    console.log('requesting deletion of parser');
    try {
        var result = await parser_manager.deleteParser(req.body.parser_id);
        let status = "Парсер ".concat(req.body.parser_name).concat(" удален!");
        res.redirect('/parsers?status='.concat(status));
    }
    catch (err){
        console.log(err);
        res.status(500).send(err);
    }
};


module.exports.getParser = async function(req, res, next) {
    if ((!req.query.parser) || (req.query.parser == '')) {
        res.redirect('/parsers?status=Парсер не найден');
        return;
    }
    console.log('requesting parser info ' + req.query.parser);
    try {
        var result = await parser_manager.getParserByName(req.query.parser_name);
        console.log(result);
        res.render('parser_info', {status : status, parser_info : result})
    }
    catch (err){
        console.log(err);
        res.status(500).send(err);
    }
};
