
exports.is_armadaloppet = function(req, res){
    res.json({'armadaloppet':1});
};

exports.list = function(req, res){
    var async = require('async');
    req.getConnection(function(err,connection)
    {
        var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
        {
            
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
     		else
     		{
                var checkpoint_list = [];
                async.forEach(checkpoint_rows, function(checkpoint, callback) {
                    var actions_query = connection.query('SELECT * FROM action WHERE beacon_id IN (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint.id+') GROUP BY event_assoc_id',function(err,action_rows)
                    {
                        if(err)
                        {
                            console.log("Error Selecting : %s ",err );
                        }
                        else
                        {
                            var temp = {'name': checkpoint.name, 'passed':action_rows.length};
                            checkpoint_list.push(temp);
                        }
                        console.log(actions_query.sql);
                        callback();
                    });
                }, function(err) {
                    if (err) return next(err);
                    res.render('racetracker',{page_title:"ArmadaLoppet!",data:checkpoint_list});
                });
     		}
            console.log(checkpoint_query.sql);
        });
     
    });
};

exports.checkpoint_map = function(req, res){
    var async = require('async');
    req.getConnection(function(err,connection)
    {
        var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
        {
            
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
            else
            {
                var checkpoint_list = [];
                async.forEach(checkpoint_rows, function(checkpoint, callback) { 
                    var action_query = connection.query('SELECT * FROM action WHERE beacon_id IN (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint.id+' ) GROUP BY event_assoc_id',function(err,action_rows)
                    {
                        if(err)
                        {
                            console.log("Error Selecting : %s ",err );
                        }
                        else
                        {
                            var beacon_query = connection.query('SELECT * FROM beacon WHERE checkpoint_id='+checkpoint.id,function(err,beacon_rows)
                            {
                                var locations = [];
                                beacon_rows.forEach(function(beacon)
                                {
                                    if (beacon.pos_latitude && beacon.pos_longitude)
                                    {
                                        locations.push({'lat': beacon.pos_latitude, 'long':beacon.pos_longitude})
                                    }
                                });

                                var temp = {'name': checkpoint.name, 'passed':action_rows.length, 'cords':locations};
                                
                                checkpoint_list.push(temp);
                                callback();
                            });
                        }
                        console.log(action_query.sql);
                    });
                }, function(err) {
                    if (err) return next(err);
                    console.log(JSON.stringify(checkpoint_list));
                    res.json({'status':'OK', 'checkpoints':checkpoint_list})
                });
            }
            console.log(checkpoint_query.sql);
        });
     
    });
};
exports.checkpoint_status = function(req, res){
    var async = require('async');
    req.getConnection(function(err,connection)
    {
        var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
        {
            
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
            else
            {
                var checkpoint_list = [];
                async.forEach(checkpoint_rows, function(checkpoint, callback) {
                    var actions_query = connection.query('SELECT * FROM action WHERE beacon_id IN (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint.id+' ) GROUP BY event_assoc_id',function(err,action_rows)
                    {
                        if(err)
                        {
                            console.log("Error Selecting : %s ",err );
                        }
                        else
                        {
                            var temp = [checkpoint.name, action_rows.length];
                            checkpoint_list.push(temp);
                        }
                        console.log(actions_query.sql);
                        callback();
                    });
                }, function(err) {
                    if (err) return next(err);
                    res.json({'draw': 1, 'recordsTotal': checkpoint_list.length, 'recordsFiltered': checkpoint_list.length,'data':checkpoint_list});
                });
            }
            console.log(checkpoint_query.sql);
        });
    });
};

exports.goal_view = function(req, res){
    var goal_name = 'GOAL'
    var async = require('async');
    req.getConnection(function(err,connection)
    {
        var checkpoint_query = connection.query("SELECT * FROM checkpoint WHERE name='"+goal_name+"'",function(err,checkpoint_rows)
        {
            
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
            else
            {
                var checkpoint_list = [];
                if (checkpoint_rows.length != 0)
                {
                    var actions_query = connection.query('SELECT * FROM action WHERE beacon_id IN (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint_rows[0].id+' ) GROUP BY first_name, last_name, team_name',function(err,action_rows)
                    {
                        if(err)
                        {
                            console.log("Error Selecting : %s ",err );
                        }
                        else
                        {
                            action_rows.forEach(function(action)
                            {
                                var temp = ["GOAL",action.first_name, action.last_name, action.team_name, action.timestamp];
                                checkpoint_list.push(temp);
                            });
                            res.json({'status': 'OK', 'data':checkpoint_list});
                        }
                        console.log(actions_query.sql);
                    });
                }
                else
                {
                    res.json({'status': 'FAILED'});
                }
                
            }
            
            console.log(checkpoint_query.sql);
        });
    });
};
