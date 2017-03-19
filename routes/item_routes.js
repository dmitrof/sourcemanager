/**
 * Created by Дмитрий on 15.03.2017.
 */
var express = require('express');
var router = express.Router();
var prefix = '';
var source_manager = require('./../modules/source_manager');
var item_manager = require('./../modules/item_manager');
var link_manager = require('./../modules/link_manager');
var item_controller = require('./../controllers/item_controller');
var setRoutes = function(app) {
    app.get(prefix.concat('/get_item/'), item_controller.getItemAndLinks);

};
module.exports.setRoutes = setRoutes;






