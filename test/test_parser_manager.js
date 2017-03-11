/**
 * Created by Дмитрий on 11.03.2017.
 */

var dbWrapper = require('./../modules/db_wrapper');

dbWrapper.initDB().then(response => {
    var parserManager = require('./../modules/parser_manager');
    var sourceManager = require('./../modules/source_manager');
    var ParserModel = require('./../models/core_schemas').Parser;

    parserManager.getParserData("YouTube", function() {
        console.log("finished getParserData");
    });
    },
    reject => {console.log("not connected to DB")}
);
