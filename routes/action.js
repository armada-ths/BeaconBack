exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM action',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );

            res.render('action',{page_title:"Actions",data:rows});
                
           
         });
         
         console.log(query.sql);
    });
  
};

exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var idata = {
                type_id     : input.type_id,
                user_id     : input.user_id,
                first_name  : input.first_name,
                last_name   : input.last_name,
                beacon_id   : input.beacon_id,
                event_assoc_id  : input.event_assoc_id,
                team_name   : input.team_name
            };
        
        var query = connection.query("INSERT INTO action set ? ",idata, function(err, rows)
        {
          if (err)
          {
              console.log("Error inserting : %s ",err );
              res.json(JSON.stringify({'status':"QUERY_FAILED"}))
          }
          else
          {
          	res.json(JSON.stringify({'status':"OK"}))
          }
       	
          
        });
        
       console.log(query.sql); //get raw query
    
    });
};