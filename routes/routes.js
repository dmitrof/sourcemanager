/**
 * Created by Дмитрий on 22.01.2018.
 */
const express = require('express');
const router = express.Router();

const source_controller = require('./../controllers/source_controller');
const parser_controller = require('./../controllers/parser_controller');
const item_controller = require('./../controllers/item_controller');
const link_controller = require('./../controllers/item_link_controller');
const source_manager = require('./../modules/source_manager');
const item_manager = require('./../modules/item_manager');

const prefix = '/sources';

/* GET home page. */
router.get('/', source_controller.getAllSources);

//PARSER ROUTES
router.get('/parsers/', parser_controller.getParsers);
router.get('/parsers/:parser_name', parser_controller.getParser);
router.post('/add_parser/', parser_controller.createParser);
router.delete('/delete_parser/:parser_id', parser_controller.deleteParser);

//SOURCETYPES ROUTES
router.get(prefix.concat('/source_types'), source_controller.getSourceTypes);
router.post(prefix.concat('/add_source_type'), source_controller.createSourceType);
router.post(prefix.concat('/delete_source_type'), source_controller.deleteSourceType);

//SOURCES ROUTES
router.get(prefix.concat('/'), source_controller.getAllSources);
//получает источник и список единиц учебного материала
router.post(prefix.concat('/get_source/'), function(req, res, next) {
    var source_url = req.body.source_url;
    console.log('get source request ' + source_url);
    var promises = [];
    var res_data = {title : "Данные источника"};

    var getSourcePromise = source_manager.getSourceByUrl(source_url);
    getSourcePromise.then(result => {
            res_data.source = result.data;
            res_data.source_status = result.status;
            console.log(result.message);
        },
        rejected => {
            if (!rejected.hasOwnProperty('err')) {
                res_data.source_status = rejected.status;
            }
        }
    ).catch(err =>
        console.log(err)
    );
    var getItemsPromise = item_manager.getAllItemsForSource(source_url);
    getItemsPromise.then(result => {
        res_data.items = result.data;
        res_data.items_status = result.status;
        console.log(result.message);
    }, rejected => {
        if (!rejected.hasOwnProperty('err')) {
            res_data.items_status = rejected.status;
        }
    }).catch(err =>
        console.log(err)
    );

    promises.push(getSourcePromise); promises.push(getItemsPromise);
    Promise.all(promises).then(resolved => {
        res.render('source_details', res_data);
    }, rejected => {
        if (rejected.hasOwnProperty('err'))
            res.status(500).send(rejected.err);
        else
            res.render('source_details', res_data);
    });

});

router.post(prefix.concat('/add_source'), source_controller.addSource);

router.post(prefix.concat('/delete_source'), source_controller.deleteSource);

router.post(prefix.concat('/delete_source'), function(req, res, next) {
    console.log('requesting source deletion');
    var source_url = req.body.source_url,
        source_type = req.body.source_type;
    console.log('add request ' + source_url + ' ' + source_type);
    res.render('index', {title : "Delete source "});
});
router.post(prefix.concat('/update_source'), function(req, res, next) {
    console.log('requesting source update');
    var source_url = req.body.source_url,
        source_type = req.body.source_type;
    console.log('add request ' + source_url + ' ' + source_type);
    res.render('index', {title : "Update source "});
});

router.get('/source_types', source_controller.getSourceTypes);

router.post('/add_source_type', source_controller.createSourceType);

router.post('/delete_source_type', source_controller.deleteSourceType);



router.get(prefix.concat('/get_source/'), function(req, res, next) {
    var source_url = req.query.source_url;
    console.log('get source request ' + source_url);
    var promises = [];
    var res_data = {title : "Данные источника"};

    var getSourcePromise = source_manager.getSourceByUrl(source_url);
    getSourcePromise.then(result => {
            res_data.source = result.data;
            res_data.source_status = result.status;
            console.log(result.message);
        },
        rejected => {
            if (!rejected.hasOwnProperty('err')) {
                res_data.source_status = rejected.status;
            }
        }
    ).catch(err =>
        console.log(err)
    );
    var getItemsPromise = item_manager.getAllItemsForSource(source_url);
    getItemsPromise.then(result => {
        res_data.items = result.data;
        res_data.items_status = result.status;
        console.log(result.message);
    }, rejected => {
        if (!rejected.hasOwnProperty('err')) {
            res_data.items_status = rejected.status;
        }
    }).catch(err =>
        console.log(err)
    );

    promises.push(getSourcePromise); promises.push(getItemsPromise);
    Promise.all(promises).then(resolved => {
        res.render('source_details', res_data);
    }, rejected => {
        if (rejected.hasOwnProperty('err'))
            res.status(500).send(rejected.err);
        else
            res.render('source_details', res_data);
    });

});

//ITEMS AND LINKS ROUTES
router.get(prefix.concat('/get_item/'), item_controller.getItemAndLinks);
router.get('/get_item/get_ontology/', link_controller.getNodesAndItem);
router.get('/get_ontology/:domain_uri', link_controller.getOntology);
router.get('/get_domains/', link_controller.getDomains)
//router.get(prefix.concat('/get_item/get_nodes'), item_controller.getNodesForItem)
router.post('/add_link_for_item/', link_controller.addLinkForItem);
router.post('/delete_item_link/', link_controller.deleteItemLink);

//TAGS ROUTES
router.get('/tags/', link_controller.getAllTags);
router.post('/create_tag/', link_controller.createTag);
router.post('/delete_tag/', link_controller.deleteTag);
router.post('/add_tag_to_item', link_controller.addTagToItem)
router.get('/get_tag/', link_controller.getTagAndOntology);

module.exports = router;
