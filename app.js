
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var async = require('async');

//load customers route
var action = require('./routes/action');
var racetracker = require('./routes/racetracker');
var beacon = require('./routes/beacon'); 
var checkpoint = require('./routes/checkpoint'); 

var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

// all environments
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var flash = require('connect-flash');
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : 'fotboll123',
        port : 3306, //port mysql
        database:'nodejs_test3'

    },'pool') //or single

);

app.get('/', routes.index);
app.get('/checkpoint', checkpoint.list);
app.get('/checkpoint/add', checkpoint.add);
app.post('/checkpoint/add', checkpoint.save);
app.get('/checkpoint/delete/:id', checkpoint.delete_checkpoint);
app.get('/checkpoint/edit/:id', checkpoint.edit);
app.post('/checkpoint/edit/:id',checkpoint.save_edit);
app.get('/checkpoint/show/:id', checkpoint.show);

app.get('/checkpoint/compare/:ids', checkpoint.compare)

app.get('checkpoint/idList',checkpoint.id_list);

app.get('/beacon', beacon.list);
app.get('/beacon/add', beacon.add);
app.post('/beacon/add', beacon.save);
app.get('/beacon/delete/:id', beacon.delete_beacon);
app.get('/beacon/edit/:id', beacon.edit);
app.post('/beacon/edit/:id',beacon.save_edit);

app.get('/action', action.list);
app.post('/action/add', action.save);
app.get('/action/clear', action.clear_action);

app.get('/armadaloppet', racetracker.list);
app.get('/armadaloppet/checkpointMap', racetracker.checkpoint_map);
//app.get('/armadaloppet/checkpointStatus', racetracker.checkpoint_status);
app.get('/armadaloppet/GoalView', racetracker.goal_view);


app.get('/isArmadaloppet', racetracker.is_armadaloppet);

app.use(app.router);


app.get('/', function(req, res){
  res.render('index', { message: req.flash('info') });
});

app.get('/error-flash', function(req, res){
  req.flash('Error', 'Hi there!')
  res.redirect('/');
});

app.get('/no-flash', function(req, res){
  res.redirect('/');
});

app.get('*', function(req, res){
  res.send('404', 404);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

