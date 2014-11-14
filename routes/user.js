exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    var user_query = connection.query('SELECT user_id FROM action GROUP BY user_id',function(err,user_rows)
    {
      if(err)
          console.log("Error Selecting : %s ",err );

      res.render('action',{page_title:"Actions",data:rows});
     });
     console.log(query.sql);
  });
}
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