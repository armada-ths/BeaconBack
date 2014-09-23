
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
        password : 'fotboll123',
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


var net = require('net');
var t = require('tcomb-validation');
var domain =  require('./domain');

var server = net.createServer(function(c) { //'connection' listener
  console.log('server connected');
  c.on('end', function() {
    console.log('server disconnected');
  });
  //c.write('hello\r\n');
  //c.pipe(c);
  var input = JSON.parse(c);

  // one-liner validation
  var result = t.validate(input, domain.action);

  if (result.isValid()) {

    // ..your logic here..

    // using SignUpOutput it's not mandatory, but enforces the contract
    var output = new domain.SignUpOutput({id: 1, username: 'giulio', locale: 'it_IT'});
    var query = connection.query("INSERT INTO action set ? ",input.payload, function(err, rows)
    {

      if (err)
          console.log("Error inserting : %s ",err );
      
    });

  } else {
    // in result.errors there are details on the validation failure
    res.status(400).json(result.errors);
  }
});
server.listen(1338, function() { //'listening' listener
  console.log('server bound');
});