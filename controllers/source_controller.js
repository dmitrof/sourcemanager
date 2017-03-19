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
        //console.log(result);
        res.redirect('../');
    }
    catch (err) {
        console.log('add source error ' + err);
        res.status(500).send(err);
    }
};
module.exports.addSource = addSource;

var getSourceTypeById = async function(req, res, next) {
    console.log()
};
module.exports.getSourceById = getSourceTypeById;

var getSourceTypes = async function(req, res, next) {
    console.log('requesting source types');
    var status = "";
    if (req.query.status)
        status = req.query.status;
    try {
        var result = await source_manager.getSourceTypes();
        //console.log(result);
        res.render('add_source_type', {status : status, source_types : result});
    }
    catch (e){
        console.log(e);
    }
};
module.exports.getSourceTypes = getSourceTypes;

var createSourceType = async function(req, res, next) {
    console.log('requesting add source type ' + req.body.type);
    var data = {type : req.body.type,  description : req.body.description,
        parser : req.body.parser, added_by : "Kostyl user", metadata : req.body.metadata};
    try {
        var result = await source_manager.createSourceType(data);
        res.redirect('/source_types?status=source_created' );
    }
    catch (err){
        console.log(err);
        res.status(500).send(err);
    }
};
module.exports.createSourceType = createSourceType;

var deleteSourceType = async function(req, res, next) {
    console.log('requesting deletion source type ' + req.body.type + ' of id: ' + req.body.id);
    if ((!req.body.source_type_id) || (req.body.source_type_id == '')) {
        let status = "delete fail";
        res.redirect('/source_types?status='.concat(status));
        return;
    }
    try {
        var result = await source_manager.deleteSourceType(req.body.source_type_id);
        let status = "deleted";
        res.redirect('/source_types?status='.concat(status));
    }
    catch (err){
        console.log(err);
        res.status(500).send(err);
    }
};
module.exports.deleteSourceType = deleteSourceType;
