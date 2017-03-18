/**
 * Created by Дмитрий on 11.03.2017.
 */

var dbWrapper = require('./../modules/db_wrapper');

dbWrapper.initDB().then(response => {
    var parserManager = require('./../modules/parser_manager');
    var sourceManager = require('./../modules/source_manager');
    var ParserModel = require('./../models/parser');
    var parserName = "shta"; sourceType = "shtasource";
    parser = new ParserModel({
            name : parserName,
            source_type : sourceType
        });
    parserManager.saveParserData(parser).then(
        resolve => {
            console.log(resolve);
            return parserManager.getParserByType(sourceType);
        },
        reject => {
            console.log(reject);
        }
    ).then(parserModel => {
        return parserManager.removeParserByType(parserModel.source_type)
    }).then(
        resolve => console.log("все ок")

    ).catch(error => {
        console.log(error);
    });

    },
    reject => {console.log("not connected to DB")});


