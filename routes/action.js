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
