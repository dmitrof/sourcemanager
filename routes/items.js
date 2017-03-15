/**
 * Created by Дмитрий on 15.03.2017.
 */
var express = require('express');
var router = express.Router();
var prefix = '';
var source_manager = require('./../modules/source_manager');
var item_manager = require('./../modules/item_manager');
var link_manager = require('./../modules/link_manager');
var setRoutes = function(app) {
    app.post(prefix.concat('/get_item/'), function(req, res, next) {
        var item_name = req.body.item_name;
        var res_data = {title : "Информация о контенте"};
        console.log('get item request: ' + item_name);
        var getItemPromise = item_manager.getItemByName(item_name);
        getItemPromise.then(result => {
            res_data.item = result.data;
            res_data.item_status = result.status;
            console.log(result.message);
        }, rejected => {
                if (!rejected.hasOwnProperty('err')) {
                    res_data.source_status = rejected.status;
                }
            }
        ).catch(err =>
            console.log(err)
        );
        var getItemLinksPromise = link_manager.getLinksByItem(item_name);
        getItemLinksPromise.then(result => {
                res_data.item_links = result.data;
                res_data.item_links_status = result.status;
            }, rejected => {
                if (!rejected.hasOwnProperty('err')) {
                    res_data.item_links_status = rejected.status;
                }
            }
        ).catch(err =>
            console.log(err)
        );


        Promise.all([getItemPromise, getItemLinksPromise]).then(resolved => {
            res.render('item', res_data);
        }, rejected => {
            if (rejected.hasOwnProperty('err'))
                res.status(500).send(rejected.err);
            else
                res.render('item', res_data);
        });
    });
};
module.exports.setRoutes = setRoutes;






