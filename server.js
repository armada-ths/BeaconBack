var _mysql = require('mysql');

var HOST = 'localhost';
var PORT = 3306;
var MYSQL_USER = 'nodehacker';
var MYSQL_PASS = 'lulwut';
var DATABASE = 'nodedb';
var TABLE = 'gadgets';

var mysql = _mysql.createClient({
    host: HOST,
    port: PORT,
    user: MYSQL_USER,
    password: MYSQL_PASS,
});


var net = require('net');
 
var server = net.createServer(function(socket) {
	socket.write('Echo server\r\n');
	socket.pipe(socket);
});
 
server.listen(1337, '127.0.0.1');