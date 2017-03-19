/**
 * Created by Дмитрий on 14.03.2017.
 */
var dbWrapper = require('./../../modules/db_wrapper');

dbWrapper.initDB().then(response => {
    var sourceManager = require('./../../modules/source_manager');
    var parserManager = require('./../../modules/parser_manager');
    var core_schemas = require('./../models/core_schemas');
    var Source = core_schemas.Source;
    var ParserModel = core_schemas.Parser;

    var source_url = "https://www.youtube.com/channel/UCs7alOMRnxhzfKAJ4JjZ7Wg";
    var source_type = "youtube";
    var parser = new ParserModel({name : "youtube_fetcher", source_type : source_type, saves_attachments : false});
    parserManager.getParserByType(source_type).then(parserInfo => {
        if (parserInfo) {
            console.log("there is already a parser");
            return true;
        }
        else return parserManager.saveParserData(parser)
    }).then(resolve => {
        console.log(resolve);
        return sourceManager.addAndParseSource(source_url, source_type, {});
    }).then(source_saved => {
        console.log(source_saved);
    }).catch(error => {
        console.log(error);
    });

    }, reject => {console.log("not connected to DB")}
);