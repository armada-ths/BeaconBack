exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
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