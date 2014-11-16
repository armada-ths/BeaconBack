
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
var fair = require('./routes/fair');
var user = require('./routes/user');
var report = require('./routes/report');
var company = require('./routes/company');
var map = require('./routes/map');



//var posix = require('posix');
// raise maximum number of open file descriptors to 10k,
//posix.setrlimit('nofile', { soft: 10000,  hard: 10000 });

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

app.use(express.static(path.join(__dirname, '/public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var flash = require('connect-flash');
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());

var db_options = {
    host: 'localhost',
    user: 'root',
    password : 'password',
    port : 3306,
    database:'armada_fair_test'
  }

app.use(
  connection(mysql,db_options,'pool') //or single
);
var arguments = process.argv.slice(2);
console.log(arguments);
if(arguments.length > 0){
  if(arguments[0] == "--update_companies"){
    var req = http.get('http://127.0.0.1:3000/api/map_info.json', function(res){
      var body = '';

      res.on('data', function(chunk) {
          body += chunk;
      });

      res.on('end', function() {
        var response = JSON.parse(body)
        response.forEach(function(input){
          var data = {
              company_id    : input.id,
              company_name  : input.name
              //location      : 'POINT('+input.coord_x+', '+input.coord_y+')',
              //map           : input.map
          };
          var c = mysql.createConnection(db_options);

          c.connect(function(err) {
            var query = c.query("INSERT INTO company set ? ",data, function(err, rows){
              if (err)
                  console.log("Error inserting : %s ",err );
              console.log(query.sql); //get raw query
            });
          });
          
          
        });
      });
    });
  }
  if(arguments[0] == "--update_maps"){
    var fs = require('fs');
    var gm = require('gm').subClass({ imageMagick: true });
    var map_files = fs.readdirSync("./public/map_templates/")
    map_files.forEach(function(input){
      console.log("Adding map in db: "+input);
      gm('./public/map_templates/'+input).size(function (err, size) {
        if (!err) {
          var data = {
          map_name    : input,
          url         : '/map_templates/'+input,
          height      : size.height,
          width       : size.width
          };
          var c = mysql.createConnection(db_options);

          c.connect(function(err) {
            var query = c.query("INSERT INTO map set ? ",data, function(err, rows){
              if (err)
                console.log("Error inserting : %s ",err );
            console.log(query.sql);
            });
          });
        }
        else{
          console.log(err);
        }
      });
    });
  } 
}

var cache = require('memory-cache');

var c = mysql.createConnection(db_options);

c.connect(function(err) {
  var query = c.query("SELECT * FROM company;", function(err, rows){

    if (err)
        console.log("Error inserting : %s ",err );
    cache.put( "company_list", rows );
    console.log(query.sql); //get raw query
  });
});

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

app.get('armadaloppet/action', action.list);
app.post('armadaloppet/action/add', action.save);
app.get('armadaloppet/action/clear', action.clear_action);

app.get('/armadaloppet', racetracker.list);
app.get('/armadaloppet/checkpointMap', racetracker.checkpoint_map);
app.get('/armadaloppet/GoalView', racetracker.goal_view);
app.get('/isArmadaloppet', racetracker.is_armadaloppet);


app.get('/fair', fair.list);
app.get('/fair/status', fair.status);
app.get('/fair/isFair',fair.is_fair);

app.post('/fair/report/add', report.save);
app.get('/fair/report', report.list);
app.get('/fair/report/clear', report.clear_report);

app.get('/fair/map', map.list);
app.get('/fair/map_list', map.list_api);

app.get('/fair/company', company.list);
//app.get('/fair/company/show/:id', company.show);
app.get('/fair/company/placement', company.placement);
app.post('/fair/company/save_placement', company.save_placement);

app.get('/fair/user', user.list);
app.get('/fair/user/story/:id', user.story);

app.get('/fair/userstories', fair.user_stories);
app.get('/fair/beacontraffic/:id', fair.beacon_show);
app.get('/fair/heatmap', fair.heatmap);

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

