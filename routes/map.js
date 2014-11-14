exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}