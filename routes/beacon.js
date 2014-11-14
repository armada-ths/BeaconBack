
/*
 * GET beacon listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){
        //GROUP BY checkpoint_id
        var query = connection.query('SELECT * FROM beacon',function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );

            var checkpoint_translationlist = [];
            for(var i =0; i < rows.length; i++){
              var cQuery = connection.query('SELECT * FROM checkpoint WHERE id ='+rows[i].checkpoint_id,function(err,checkp)
              {
                if(err){
                  console.log("Error Selecting : %s ",err );
                  checkpoint_translationlist.push(row[i].checkpoint_id);
                }
                else{
                  checkpoint_translationlist.push(checkp.name);
                }
              });
            }
            
            res.render('beacon',{page_title:"Beacons",data:rows, checkpoint_names:checkpoint_translationlist});
         });
         console.log(query.sql);
    });
};

exports.add = function(req, res){
  req.getConnection(function(err,connection){
    var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
    {
      if(err)
          console.log("Error Selecting : %s ",err );
      else{
        var map_query = connection.query('SELECT * FROM map',function(err,map_rows)
        {
          if(err)
              console.log("Error Selecting : %s ",err );
          else{
            res.render('add_beacon',{page_title:"Add Beacons",checkpoint_list:checkpoint_rows, maps:map_rows});          }
          //res.render('add_beacon',{page_title:"Add Beacons",checkpoint_list:rows, maps:map_files});      
        });  
      }
      //res.render('add_beacon',{page_title:"Add Beacons",checkpoint_list:rows, maps:map_files});      
    });
  });
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM beacon WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_beacon',{page_title:"Edit beacon",data:rows});
                
           
         });
         
         console.log(query.sql);
    }); 
};

/*Save the beacon*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            id            : input.id,
            name          : input.name,
            checkpoint_id : input.checkpoint,
            location      : 'POINT('+input.pos_x+','+pos_y+')'
            pos_longitude : input.pos_longitude,
            pos_latitude  : input.pos_latitude,
            map           : input.map
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

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            //id    : input.id,
            name  : input.name
        };
        
        connection.query("UPDATE beacon set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/beacon');
          
        });
    
    });
};


exports.delete_beacon = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM beacon  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/beacon');
             
        });
        
     });
};


