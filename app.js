
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

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
        password : 'password',
        port : 3306, //port mysql
        database:'nodejs_test'

    },'pool') //or single

);

app.get('/', routes.index);
app.get('/checkpoint', checkpoint.list);
app.get('/checkpoint/add', checkpoint.add);
app.post('/checkpoint/add', checkpoint.save);
app.get('/checkpoint/delete/:id', checkpoint.delete_checkpoint);
app.get('/checkpoint/edit/:id', checkpoint.edit);
app.post('/checkpoint/edit/:id',checkpoint.save_edit);

app.get('/beacon', beacon.list);
app.get('/beacon/add', beacon.add);
app.post('/beacon/add', beacon.save);
app.get('/beacon/delete/:id', beacon.delete_beacon);
app.get('/beacon/edit/:id', beacon.edit);
app.post('/beacon/edit/:id',beacon.save_edit);

app.get('/action', action.list);

app.get('/armadaloppet', racetracker.list);


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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var net = require('net')

var Validator = require('jsonschema').Validator;
var v = new Validator();

var domain =  require('./domain');

var db_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'password',
    port : 3306, //port mysql
    database:'nodejs_test'
});

db_connection.connect(function(err) {
  // connected! (unless `err` is set)
});

var server = net.createServer(function(c) { //'connection' listener
    console.log('server connected');
    c.on('end', function() {
        console.log('server disconnected');
    });
    c.on('data', function(data){
        var input = JSON.parse(data);
        console.log(JSON.stringify(input));
        //var result = v.validate(input, domain.action);//t.validate(input, domain.action);
        if (input) 
        {
            var idata = {
                type_id     : input.type_id,
                user_id     : input.user_id,
                first_name  : input.first_name,
                last_name   : input.last_name,
                beacon_id   : input.beacon_id,
                event_assoc_id  : input.event_assoc_id,
                team_name   : input.team_name
            };
            var query = db_connection.query("INSERT INTO action set ? ",idata, function(err, rows)
            {
              if (err)
              {
                  console.log("Error inserting : %s ",err );
                  c.write(JSON.stringify({'status': 'QUERY_FAILED'}));
                  c.pipe(c);
              }
              else
              {
                c.write(JSON.stringify({'status': 'OK'}));
                c.pipe(c);
              }
            });
        } 
        else 
        {
            c.write(JSON.stringify({'status': 'FAILED'}));
        }
    });
});
server.listen(1338, function() { //'listening' listener
  console.log('server bound');
});
