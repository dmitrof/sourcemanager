/**
 * Created by Дмитрий on 14.03.2017.
 */
var express = require('express');
var router = express.Router();
var prefix = '/sources';
var source_manager = require('./../modules/source_manager');

var setRoutes = function(app) {
    //TODO здесь должны учитываться данные фильтров
    app.get(prefix.concat('/'), function(req, res, next) {
        console.log('requesting sources list');
        //filter_data = {key }
        source_manager.getSources().then(sources => {
            //res.send('yeah');
            res_data = {status : "sources_list_request", sources : sources, title : "sources_list"};
            res.render('sources_list', res_data);
        }).catch(reject => {console.log('bad');res.status(500).send(reject)});
        //res.render('test_ejs', {status : "sources_list_request", sources : ['s1', 's2']});

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