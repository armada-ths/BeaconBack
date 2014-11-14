exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    var query = connection.query('SELECT * FROM company',function(err,rows)
    {
      if(err)
        console.log("Error Selecting : %s ",err );
      res.render('company',{page_title:"company",companies:rows});
     });
  });
}

exports.show = function(req, res){   
  var id = req.params.id;
  
  req.getConnection(function(err,connection)
  {
    var query = connection.query('SELECT * FROM company WHERE id = ?',[id],function(err,rows)
    {
      if(err)
        console.log("Error Selecting : %s ",err );
      res.render('show_checkpoint',{page_title:"checkpoint",data:rows});
    });
    console.log(query.sql);
  }); 
};