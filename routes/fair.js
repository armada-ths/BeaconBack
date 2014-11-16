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

exports.heatmap = function(req, res){
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

exports.user_stories = function(req, res){
  var async = require('async');
  req.getConnection(function(err,connection)
  {
    var report_query = connection.query('SELECT * FROM report ORDER timestamp ASC SPLIT BY user',function(err,report_rows)
    {
      if(err)
      {
        console.log("Error Selecting : %s ",err );
      }
      else
      {
        res.render('fair_userstory',{page_title:"Fair user stories", data:report_rows});
      }
      console.log(report_query.sql);
    });    
  });
};

exports.beacon_show = function(req, res){
  var input = req.params;
  req.getConnection(function(err,connection)
  {
    var report_query = connection.query('SELECT * FROM report WHERE id IN (SELECT report FROM hit WHERE beacon=?) ORDER BY timestamp ASC',input.id,function(err,beacon_rows)
    {
      if(err)
      {
          console.log("Error Selecting : %s ",err );
      }
      else
      {
          res.render('traffic_beacon',{page_title:"Beacon traffic", data:beacon_rows});
      }
      console.log(report_query.sql);
    });    
  });
};

