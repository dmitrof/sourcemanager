/**
 * Created by Дмитрий on 18.03.2017.
 */

var dbWrapper = require('./../modules/db_wrapper');

dbWrapper.initDB().then(response => {
    var parserManager = require('./../modules/parser_manager');
    var sourceManager = require('./../modules/source_manager');
    var ParserModel = require('./../models/parser');
    var parserName = "shtaa";
    sourceType = "shtasource";
    var parser = new ParserModel({
        name: parserName,
        source_type: sourceType
    });
    var req = {data: parser};
    try {
        parserManager.getParserByName(parserName).then(doc => console.log(doc)).catch(err => console.log(err));

    }
    catch(e) {
        console.log(e);
    }


},reject => {console.log("not connected to DB")});


async function logDoc(_name) {
    var doc = await parserManager.getParserByName(_name);

}