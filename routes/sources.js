/**
 * Created by Дмитрий on 14.03.2017.
 */
var express = require('express');
var router = express.Router();
var prefix = '/sources';
var source_manager = require('./../modules/source_manager');
var item_manager = require('./../modules/item_manager');

var setRoutes = function(app) {
    //TODO здесь должны учитываться данные фильтров
    app.get(prefix.concat('/'), function(req, res, next) {
        console.log('requesting sources list');
        //filter_data = {key }
        source_manager.getSources().then(sources => {
            let res_data = {status : "Получен список источников", sources : sources, title : "sources_list"};
            res.render('add_source', res_data);
        }).catch(reject => {console.log('bad');res.status(500).send(reject)});
        //res.render('test_ejs', {status : "sources_list_request", sources : ['s1', 's2']});
    });
    //получает источник и список единиц учебного материала
    app.post(prefix.concat('/get_source/'), function(req, res, next) {
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

    app.post(prefix.concat('/add_source'), function(req, res, next) {
        console.log('requesting source addition');
        var source_url = req.body.source_url,
            source_type = req.body.source_type;
        console.log('add request ' + source_url + ' ' + source_type);
        res.render('index', {title : "Add source "});
    });




    app.post(prefix.concat('/delete_source'), function(req, res, next) {
        console.log('requesting source deletion');
        var source_url = req.body.source_url,
            source_type = req.body.source_type;
        console.log('add request ' + source_url + ' ' + source_type);
        res.render('index', {title : "Delete source "});
    });
    app.post(prefix.concat('/update_source'), function(req, res, next) {
        console.log('requesting source update');
        var source_url = req.body.source_url,
            source_type = req.body.source_type;
        console.log('add request ' + source_url + ' ' + source_type);
        res.render('index', {title : "Update source "});
    });



    app.get(prefix.concat('/source_types'), function(req, res, next) {
        console.log('requesting source types list');
        res.render('index', {title : "source TYPE"});
    });

    app.post(prefix.concat('/add_source_type'), function(req, res, next) {
        console.log('requesting source TYPE addition');
        var source_url = req.body.source_url,
            source_type = req.body.source_type;
        console.log('add request ' + source_url + ' ' + source_type);
        res.render('index', {title : "Add source TYPE"});
    });

    app.post(prefix.concat('/delete_source_type'), function(req, res, next) {
        console.log('requesting source TYPE deletion');
        var source_url = req.body.source_url,
            source_type = req.body.source_type;
        console.log('add request ' + source_url + ' ' + source_type);
        res.render('index', {title : "DELETE source TYPE"});
    });

    app.post(prefix.concat('/update_source_type'), function(req, res, next) {
        console.log('requesting source TYPE update');
        var source_url = req.body.source_url,
            source_type = req.body.source_type;
        console.log('add request ' + source_url + ' ' + source_type);
        res.render('index', {title : "UPDATE source TYPE"});
    });
    console.log('app routes for sources are set');
};
module.exports.setRoutes = setRoutes;







/* TODO почему то router не имеет post-метода */
router.get('/sources_list', function(req, res, next) {
    console.log('requesting sources list');
    res.render('add_source', {title : "Add source"});
});

router.post('add_source', function(req, res, next) {
    console.log('requesting source addition');
    var source_url = req.body.source_url,
        source_type = req.body.source_type;
    console.log('add request ' + source_url + ' ' + source_type);
    res.render('index', {title : "Add source "});
});

router.get('/source_types', function(req, res, next) {
    console.log('requesting source types list');
    res.render('index', {title : "source TYPE"});
});


router.post('/add_source_type', function(req, res, next) {
    console.log('requesting source TYPE addition');
    var source_url = req.body.source_url,
        source_type = req.body.source_type;
    console.log('add request ' + source_url + ' ' + source_type);
    res.render('index', {title : "Add source TYPE"});
});

module.exports.router = router;