/**
 * Created by Дмитрий on 18.03.2017.
 */


var source_manager = require('./../modules/source_manager');
var item_manager = require('./../modules/item_manager');
var parser_manager = require('./../modules/parser_manager');

module.exports.getAllSources = async function(req, res, next) {
    try {
        console.log('requesting sources list');
        var [sources_result, source_types_result] = await Promise.all([source_manager.getSources(), source_manager.getSourceTypes()]);
        var res_data = {status : req.query.status, sources_status : sources_result.message, sources : sources_result.data,
            source_types_status : source_types_result.message, source_types : source_types_result.data};

        res.render('add_source', res_data);
    }
    catch(err) {
        console.log(err);
        res.status(500).send(reject)
    };
};

var addSource = async function(req, res, next) {
    console.log('requesting source addition');
    var source_data = {url : req.body.source_url,  name : req.body.source_name, type : req.body.source_type, description : req.body.description};
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

var deleteSource = async function(req, res, next) {
    if (req.body.delete_content)
        deleteSourceAndContent(req, res, next)
    else {
        try {
            delete_result = await source_manager.removeSourceByUrl(req.body.source_url);
            res.redirect('/sources?status=' + delete_result.message);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
};
module.exports.deleteSource = deleteSource;

var deleteSourceAndContent = async function(req, res, next) {

};
module.exports.deleteSourceAndContent = deleteSourceAndContent;



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
        var [types_result, parsers_result] = await Promise.all([source_manager.getSourceTypes(),
                                            parser_manager.getParsers()]);
        //console.log(result);
        res.render('add_source_type', {status : types_result.message, source_types : types_result.data,
            parser_list : parsers_result.data, parsers_status : parsers_result.message});
    }
    catch (e){
        console.log(e);
        res.status(500).send(e);
    }
};
module.exports.getSourceTypes = getSourceTypes;

var createSourceType = async function(req, res, next) {
    console.log('requesting add source type ' + req.body.type);
    var data = {type : req.body.type,  description : req.body.description,
        parser : req.body.parser_select, added_by : "Kostyl user", metadata : req.body.metadata};
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
