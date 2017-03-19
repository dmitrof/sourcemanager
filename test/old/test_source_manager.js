var dbWrapper = require('./../../modules/db_wrapper');


dbWrapper.initDB().then(response => {
    var sourceManager = require('./../../modules/source_manager');
    var Source = require('./../models/core_schemas').Source;
    var source_url = "www.com"; var source_type = "hzchto";


    sourceManager.addSource(source_url, source_type, "source_info")
    .then(addSuccess => {
        return sourceManager.getSourceByUrl(source_url);
    }).then(source => {
        console.log("source url is ".concat(source.url));
        return sourceManager.removeSourceByUrl(source.url);
    }).then(resolve => {console.log("все ок");
    dbWrapper.closeConnection()}).catch(error => {
        console.log(error);
    });


    },
    reject => {console.log("not connected to DB")});