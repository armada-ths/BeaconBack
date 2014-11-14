exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            id    : input.id,
            name  : input.name,
            checkpoint_id : input.checkpoint,
            pos_longitude : input.pos_longitude,
            pos_latitude : input.pos_latitude
        };
        
        var query = connection.query("INSERT INTO beacon set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/beacon');
          
        });
        
       console.log(query.sql); //get raw query
    
    });
};
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
exports.clear_report = function(req,res){
        
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