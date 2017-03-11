var dbWrapper = require('./../modules/db_wrapper');

dbWrapper.initDB(function(err) {
    //console.log('smth happening');
    if (err) {
        console.log(err);
        throw err;
    }
    var parserManager = require('./../modules/parser_manager');
    var sourceManager = require('./../modules/source_manager');
    //var schemas = require('./../models/core_schemas');

    parserManager.getParserData();




});
dbWrapper.closeConnection();