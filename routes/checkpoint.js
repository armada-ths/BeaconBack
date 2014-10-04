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


exports.show = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM checkpoint WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('show_checkpoint',{page_title:"checkpoint",data:rows});
                
           
         });
         
         console.log(query.sql);
    }); 
};

exports.id_list = function(req, res){
  req.getConnection(function(err,connection){ 
    var query = connection.query('SELECT id FROM checkpoint',function(err,rows)
    {       
      if(err)
        console.log("Error Selecting : %s ",err );

      res.json({'status': 'OK', 'data':rows});         
     });    
     console.log(query.sql);
  }); 
};


exports.compare = function(req, res){
    
  var c_ids = req.params.ids.split(',');

  req.getConnection(function(err,connection){
     
    var checkpoint_list = [];
      var actions_query = connection.query('SELECT a1.*, ABS(TIMESTAMPDIFF(second, a1.timestamp, a2.timestamp)) AS timediff\
        FROM action a1 \
        INNER JOIN\
        action a2\
        on a1.user_id = a2.user_id\
        WHERE a1.checkpoint_id IN ('+c_ids.toString()+') AND a2.checkpoint_id IN ('+c_ids.toString()+') GROUP BY checkpoint_id, user_id',function(err,action_rows)
      {
        if(err)
        {
          console.log("Error Selecting : %s ",err );
        }
        else
        {
          action_rows.forEach(function(r)
          {
            if(r.timediff > 0)
            {
              //ugly but could not figure out sql to ignore the other checkpoint
              var temp = {'first_name':r.first_name, 'last_name':r.last_name, 'team_name':r.team_name, 'user_id': r.user_id,'checkpoint_id': r.checkpoint_id, 'time': r.timediff};
              checkpoint_list.push(temp);
              console.log(temp);
            }
              
            if(c_ids.indexOf(r.checkpoint_id) > -1)
            {

              console.log("FAIL: "+r.checkpoint_id +", "+c_ids)
            }
          });
          
          res.render('compare_checkpoint',{page_title:"compare(appthehill), Ignores time 0 :(",data:checkpoint_list});
        }
        console.log(actions_query.sql);
      });
  }); 
};