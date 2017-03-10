var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
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
var dbHelper = require('./modules/dbHelper');
//app.set('port', process.env.PORT || 3000);
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

dbHelper.initDB(function(err) {
    //console.log('smth happening');
    if (err) {
        console.log(err);
        throw err;
    }

    require('./models/core_schemas');
    require('./test/test_schemas');
    //console.log('listening to port 3000');
    var server = app.listen(app.get('port'), function() {
        debug('Express server listening on port ' + server.address().port);
        console.log('listening to port 3000');
    });
        //test some mongoose queries
    //app.listen(port); //database is initialized, ready to listen for connections
    this.db = require('./modules/dbHelper').db;
    this.yParser = require('./modules/youtube_parser').yParser;
    //this.yParser.setDB(db);
    this.SourceManager = require('./modules/SourceManager');
});



// catch 404 and forward to error handler


app.get('/add_yt', function(req, res) {
    this.yParser.addVideoById('Im69kzhpR3I', function(err, tr_state) {
        if (err) {console.log(err); res.send(tr_state);}
        res.send(tr_state);
    });

});

app.get('/sources_list', function(req, res) {
    //sources list and form
    res.render('add_source', {title : "Add source"});
});

app.post('/add_source', function(req, res) {
    var source_url = req.body.source_url,
        source_type = req.body.source_type;
    console.log(source_url);
    console.log(source_type);
    this.SourceManager.addSource(source_url, source_type, function(err, ok) {
        if (err) {
            console.log(err);
            res.render('add_source', {title : "Sources list", qresponse : err});
            return;
        }
        res.render('add_source', {title : "Sources list", qresponse : ok});
    });

});


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
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

/*app.listen(3000, function() {
    console.log('listening on 3000')
});*/


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