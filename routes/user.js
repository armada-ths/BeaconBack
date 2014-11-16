exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    var user_query = connection.query('SELECT * FROM user',function(err,user_rows)
    {
      if(err)
          console.log("Error Selecting : %s ",err );

      res.render('user',{page_title:"Actions",data:user_rows});
     });
     console.log(user_query.sql);
  });
}
exports.story = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
        var query = connection.query('SELECT * FROM report WHERE user=? ORDER BY timestamp ASC',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('show_user',{page_title:"User story",data:rows});
         });
         
         console.log(query.sql);
    }); 
};