exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}
exports.status = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}
exports.is_fair = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}

exports.heat_map = function(req, res){
    var async = require('async');
    req.getConnection(function(err,connection)
    {
      var report_query = connection.query('SELECT * FROM report WHERE map = ?',input.map,function(err,beacon_rows)
      {
          if(err)
          {
              console.log("Error Selecting : %s ",err );
          }
          else
          {
              
          }
          console.log(report_query.sql);
      });    
    });
};

exports.user_story = function(req, res){
  var async = require('async');
  req.getConnection(function(err,connection)
  {
    var report_query = connection.query('SELECT * FROM report WHERE user = ?',input.user,function(err,beacon_rows)
    {
        if(err)
        {
            console.log("Error Selecting : %s ",err );
        }
        else
        {
            
        }
        console.log(report_query.sql);
    });    
  });
};

exports.beacon_show = function(req, res){
    req.getConnection(function(err,connection)
    {
      var report_query = connection.query('SELECT * FROM report WHERE id IN (SELECT report FROM hit WHERE beacon=?)',input.beacon,function(err,beacon_rows)
      //ADD event_assoc_id after armadaloppet
      {
          if(err)
          {
              console.log("Error Selecting : %s ",err );
          }
          else
          {
              
          }
          console.log(report_query.sql);
      });    
    });
};

