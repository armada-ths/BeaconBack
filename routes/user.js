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
