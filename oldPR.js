/**
 * Created by Дмитрий on 08.12.2016.
 */
dbHelper = require('./modules/db_wrapper');
db = dbHelper.db;
itemProvider = dbHelper.itemProvider;
db.collection('quotes');

module.exports.setDB = function(_db) {
    this.db = _db;
};

var parserRouter = {
    sources_types : require('./config/source_types'),
    sources_urls : require('./config/source_domain'),

    //adding source to database. URL validation required
    addSource : function(source_url, source_type, callback) {
        var promises = [];
        var parser;

        p = new Promise(function(resolve, reject) {
            this.getUrlDomain();
            this.getParser(source_url, source_type, function(err, _parser) {
                if (err) {
                    console.log(err);
                    reject('source was not validated')
                }
                parser = _parser;
                resolve('source is validated')
            });
        });
        p.then(function(){
            callback(null, 'Source is added!');
        }, function(reason){
            callback(reason);
        });
        /*promises.push(p);
         Promise.all(promises).then(function() {
         callback(null, 'Source is added!');
         });*/





    },
    //validate URL and source type here, get parser
    getParser : function(source_url, source_type, callback) {
        console.log("THIS IS NOT FUNCTION");
        var parser;
        if (source_type != null) {  //get parser from source_type
            parserType = this.sources_types[source_type];
            callback(null, parser);
            var urls_list = this.sources_urls[parserType];
            //доделать ДОМЕН
            if (urls_list.indexOf(source_url) != -1) {
                parser = parserType;
                callback(null, parser);
            }
            else {callback('source URL is not valid')}


        }
    },
    //parse start parsing source's contents. Delegates logic to specific parser (for exmple jishoParser)
    parseSource : function(source, callback) {

    },
    insertSourceToDB : function(source_url, source_info, callback) {

    },
    validateUrl : function(source_url,callback) {

    },
    getUrlDomain : function(source_url, callback) {

    }


};
module.exports.SourceManager = SourceManager;