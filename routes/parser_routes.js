/**
 * Created by Дмитрий on 19.03.2017.
 */


var prefix = '/parsers';
var parser_controller = require('./../controllers/parser_controller');


var setRoutes = function(app) {
    app.get('/parsers/', parser_controller.getParsers);

    app.post('/add_parser/', parser_controller.createParser);

    app.post('/delete_parser/', parser_controller.deleteParser);

    app.get('/get_parser/', parser_controller.getParser);

    //app.post('/update_parser', parser_controller.getParser);
};
module.exports.setRoutes = setRoutes;