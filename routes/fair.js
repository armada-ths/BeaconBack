exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}
exports.status = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}
exports.is_fair = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}

exports.heat_map = function(req, res){
    var async = require('async');
    req.getConnection(function(err,connection)
    {
      var beacon_query = connection.query('SELECT * FROM beacon WHERE pos_longitude AND pos_latitude',function(err,beacon_rows)
      //ADD event_assoc_id after armadaloppet
      {
          if(err)
          {
              console.log("Error Selecting : %s ",err );
          }
          else
          {
              var heat = [];
              async.forEach(beacon_rows, function(beacon, callback) {
                var actions_query = connection.query('SELECT * FROM action WHERE beacon_id='+beacon.id+') GROUP BY event_assoc_id',function(err,action_rows)
                {
                  if(err)
                  {
                      console.log("Error Selecting : %s ",err );
                  }
                  else
                  {
                      var temp = {'pos_lat': beacon.pos_latitude, 'pos_long': pos_longitude, 'amount':action_rows.length};
                      heat.push(temp);
                  }
                  console.log(actions_query.sql);
                  callback();
                });
              }, function(err) {
                if (err) return next(err);
                res.json({'status': 'OK', 'data': heat});
              });
          }
          console.log(action_query.sql);
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
                    var action_query = connection.query('SELECT * FROM action WHERE beacon_id IN (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint.id+' ) GROUP BY checkpoint_id, user_id',function(err,action_rows)
                    //ADD event_assoc_id after armadaloppet
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