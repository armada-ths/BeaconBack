exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    var query = connection.query('SELECT * FROM action ORDER BY timestamp DESC',function(err,rows)
    {
      if(err)
          console.log("Error Selecting : %s ",err );

      res.render('action',{page_title:"Actions",data:rows});
     });
     console.log(query.sql);
  });
};

exports.save = function(req,res){
  var async = require('async');
  var input = JSON.parse(JSON.stringify(req.body));
  
  req.getConnection(function (err, connection) {
      var c_query = connection.query("SELECT * FROM checkpoint WHERE id IN (SELECT checkpoint_id FROM beacon WHERE id=?)",input.beacon_id, function(err, checkpoint_row)
      {
        if (err)
        {
            console.log("Error inserting : %s ",err );
            res.json({'status':"QUERY_FAILED"})
        }
        else
        {
          if(checkpoint_row[0])
          {
            var idata = {
              type_id     : input.type_id,
              user_id     : input.user_id,
              first_name  : input.first_name,
              last_name   : input.last_name,
              beacon_id   : input.beacon_id,
              checkpoint_id : checkpoint_row[0].id,
              event_assoc_id  : input.event_assoc_id,
              team_name   : input.team_name
            };
      
            var a_query = connection.query("INSERT INTO action set ? ",idata, function(err, rows)
            {
              if (err)
              {
                  console.log("Error inserting : %s ",err );
                  res.json({'status':"QUERY_FAILED"})
              }
              else
              {
                res.json({'status':"OK"})
              }
            });
            console.log(a_query.sql); //get raw query
          }
          else{
            {
            console.log("Error inserting : %s ",err );
            res.json({'status':"QUERY_FAILED"})
        }
          }
          
        }
      });
      console.log(c_query.sql); //get raw query
  });
};

exports.clear_action = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM action", function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/action');
             
        });
        
     });
};