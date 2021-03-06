/**
 * Created by Дмитрий on 02.12.2016.
 */
/*var express = require('express');

 */






var express = require('express')
    , routes = require('./routes')
    , favicon = require('serve-favicon')
// , user = require('./user')
    , http = require('http')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , path = require('path')
    , EmployeeProvider = require('./employeeprovider').EmployeeProvider;

var bodyParser = require('express/lib/response.js');
var users = require('./routes/users');
var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {layout: false});
//app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.configure('development', function(){
    app.use(express.errorHandler());
});

var employeeProvider= new EmployeeProvider('localhost', 27017);

//Routes

app.get('/', function(req, res){
    employeeProvider.findAll(function(error, emps){
        res.render('index', {
            title: 'Employees',
            employees:emps
        });
    });
});

app.get('/employee/new', function(req, res) {
    res.render('employee_new', {
        title: 'New Employee'
    });
});

//save new employee
app.post('/employee/new', function(req, res){
    employeeProvider.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.listen(3000);

module.exports = app;