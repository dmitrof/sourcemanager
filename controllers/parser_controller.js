/**
 * Created by Дмитрий on 19.03.2017.
 */


var source_manager = require('./../modules/source_manager');
//var parser_manager  = require('./../modules/parser_manager');
var responseHelper = require('./../utils/responseHelper');
var Parser = require('./../models/parser');


module.exports.getParsers = async function(req, res, next) {
    console.log('requesting parsers');
    responseHelper.getAndRenderData(async () => {
            let parsers = await Parser.find({}).exec();
            return {status:'', parser_list:parsers}
    }
        , 'parsers', res);
};

module.exports.getParser = async function(req, res, next) {
    let parserUri = req.params.parser_uri;
    console.log('requesting parser ' + parserUri);
    responseHelper.getAndRenderData(async () => {
        let parserInfo = await Parser.getByUri(parserUri);
        console.log(parserInfo);
        return {status:'', parser_info: parserInfo};
    }
        , 'parser_info', res);
};

module.exports.createParser = async function(req, res, next) {
    var result = responseHelper.doAndRedirect(() => {
        console.log('requesting create parser');
        var parserData = {name: req.body.name, description: req.body.description}
        parserData.saves_attachments = !!req.body.saves_attachments;
        parserData.standalone = !!req.body.standalone;
        parserData.uri = parserData.name + "_uri";
        if (parserData.standalone)
            parserData.url = req.body.parser_url;
        console.log(parserData);
        return Parser(parserData).save();
    }, '/parsers?status=haha', res);
};

module.exports.deleteParser = async function(req, res, next) {
    var result = responseHelper.doAndRedirect(() => {
        console.log("requesting deletion of pareser " + req.body.parser_id);
        return Parser.remove({_id : req.body.parser_id}).exec();
    }, '/parsers?status=haha', res);
};



