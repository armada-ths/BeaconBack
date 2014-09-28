exports.idlist = function(req, rest)
{
  req.getConnection(function(err,connection){
       
    var query = connection.query('SELECT id FROM checkpoint',function(err,rows)
    {
        if(err)
        {
            console.log("Error Selecting : %s ",err );
            res.json({'status': 'QUERY_FAILED'})
        }
        else
        {
          res.json(rows)
        }
        
     });
     console.log(query.sql);
  });
}
/*
 * GET users listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM checkpoint',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('checkpoint',{page_title:"Checkpoints",data:rows});
                
           
         });
         
         console.log(query.sql);
    });
  
};

exports.add = function(req, res){
  res.render('add_checkpoint',{page_title:"Add checkpoint"});
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM checkpoint WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_checkpoint',{page_title:"Edit checkpoint",data:rows});
                
           
         });
         
         console.log(query.sql);
    }); 
};

/*Save the checkpoint*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            //id    : input.id,
            name  : input.name
        };
        
        var query = connection.query("INSERT INTO checkpoint set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/checkpoint');
          
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
        
        connection.query("UPDATE checkpoint set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/checkpoint');
          
        });
    
    });
};


exports.delete_checkpoint = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM checkpoint  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err){
              console.log("Error deleting : %s ",err );
              //res.redirect('/checkpoint/error-flash')
                 //req.flash("errror", "hej");
              res.redirect('/checkpoint');
             }
            else{
             res.redirect('/checkpoint');
            }
             
        });
        
     });
};


