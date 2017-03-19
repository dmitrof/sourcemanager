/**
 * Created by Дмитрий on 19.03.2017.
 */

var item_manager = require('./../modules/item_manager');
var link_manager = require('./../modules/link_manager');

module.exports.getItemAndLinks = async function (req, res, next) {
    var item_name = req.query.item_name;
    var res_data = {title : "Информация о контенте"};
    if ((!item_name) || (item_name === undefined))
        { res.redirect('/sources?status='.concat("не найден контент")); return; }
    try {
        var [item_result, item_links_result] = await Promise.all([item_manager.getItemByName(item_name), link_manager.getLinksByItem(item_name)]);
        if (!item_result.success)
            { res.redirect('/sources?status='.concat(item_result.message)); return;}
        else {

            res_data.item = item_result.data;
            res_data.item_status = item_result.message;
            res_data.item_links = item_links_result.data;
            res_data.item_links_status = item_links_result.message;
            res.render('item', res_data);
        }

    }
    catch (err) {
        res.status(500).send(err);
    }


};