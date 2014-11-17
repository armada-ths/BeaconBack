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
exports.story = function(req, res)
{
  var async = require('async');
  var id = req.params.id;
  
  req.getConnection(function(err,connection)
  {
    var query = connection.query('SELECT * FROM report WHERE user=? ORDER BY timestamp ASC',[id],function(err,rows)
    {
      if(err)
          console.log("Error Selecting : %s ",err );
      var totalReports = []
      async.forEach(rows, function(report, callback) {
        var query = connection.query('SELECT name FROM beacon WHERE id IN (SELECT beacon FROM hit WHERE report='+report.id+')',function(err,beacons)
        {
          if(err)
            console.log("Error Selecting : %s ",err );
          //console.log(beacons[0].name)
          report.beacons = beacons;
          totalReports.push(report)
          callback();
        });

      }, function(err) {
        if (err) return next(err);
          console.log(totalReports);
          res.render('show_user',{page_title:"User story",data:totalReports});
      });
    });
    console.log(query.sql);
  }); 
};