var net = require('net')

var Validator = require('jsonschema').Validator;
var v = new Validator();

var domain =  require('./domain');

var db_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : 'fotboll123',
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
