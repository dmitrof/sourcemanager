/**
 * Created by Дмитрий on 18.03.2017.
 */


var source_manager = require('./../modules/source_manager');
var item_manager = require('./../modules/item_manager');


var addSource = async function(req, res, next) {
    console.log('requesting source addition');
    var source_data = {url : req.body.source_url,  name : req.body.name, type : req.body.source_type, description : req.body.description};
    try {
        var result = await source_manager.addAndParseSource(source_data);
        console.log(result);
        res.redirect('./sources/');
    }
    catch (err) {
        console.log('add source error ' + err);
        res.status(500).send(err);
    }

};

module.exports.addSource = addSource;