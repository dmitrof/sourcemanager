var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var sources_routes = require('./routes/sources_routes');
var parser_routes = require('./routes/parser_routes');
var item_routes = require('./routes/items');

var app = require('express')();
var debug = require('debug')('express-parser-3:server');
var http = require('http');
////////////////////////////////////////////
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/* DB VARIABLES */
var dbWrapper = require('./modules/db_wrapper');
//app.set('port', process.env.PORT || 3000);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

console.log('sup');
/*точка входа - подключение к БД */
dbWrapper.initDB().then(db_connected => {


    console.log('starting app init');
    initRoutes();
    app.listen(app.get('port'), function() {
        console.log('listening on ' + port);
    });

}).catch(err => {console.log('failed to initialize app '+ err); throw err;});



// catch 404 and forward to error handler

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = app;


/*function initSchemas() {
    require('models');
}*/


function initRoutes() {

    //дичайший костыль
    sources_routes.setRoutes(app);
    item_routes.setRoutes(app);
    parser_routes.setRoutes(app);


    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        })
    });
    console.log('routes added');

}