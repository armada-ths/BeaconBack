exports.save = function(req,res){
  /*
    Strategy:
    find beacons
    find map
    find user/create
    calc user location
    create report
    create hit per beacon for that report
    check if type ==0 //update
      send ok
    check if type==1 //info
      find adjecent companies
      send user location, adjecent companies, map
  */
  var async = require('async');
  var cache = require('memory-cache');
  var input = JSON.parse(JSON.stringify(req.body));
  beacon_ins = input.beacons.toString()
  req.getConnection(function (err, connection)
  {
    var b_query = connection.query("SELECT * FROM beacon WHERE id IN ("+beacon_ins+");", function(err, beacon_rows)
    {
      if (err)
      {
          console.log("Error inserting : %s ",err );
          res.json({'status':"QUERY_FAILED"})
      }
      if(!beacon_rows){
        res.json({'status':"QUERY_FAILED"})
      }
      
      else
      {
        //console.log(beacon_rows);
        var m_query = connection.query("SELECT * FROM map WHERE id = ?;",beacon_rows[0].map, function(err, map_row)
        {
          if (err)
          {
              console.log("Error inserting : %s ",err );
              res.json({'status':"QUERY_FAILED"})
          }
          else
          {
            var u_query = connection.query("INSERT IGNORE INTO user SET user_id=?;",
              [input.user_id, input.user_id], function(err, user_row)
            {
              if (err)
              {
                  console.log("Error inserting : %s ",err );
                  res.json({'status':"QUERY_FAILED"})
              }
              else
              {
                //Ta ut users position
                var sum_x = 0;
                var sum_y = 0;
                var nr_beacons = 0;
                //console.log("THE RECEIVED BEACONS"+beacon_rows.length);
                async.forEach(beacon_rows, function(beacon_row, callback) {
                  console.log(beacon_row.map, map_row[0].id);
                  if(beacon_row.map == map_row[0].id){
                    sum_x += beacon_row.location.x;
                    sum_y += beacon_row.location.y;
                    nr_beacons += 1;
                  }
                  
                  callback();
                }, function(err) {
                  if (err) return next(err);

                  var pos_x = sum_x/nr_beacons;
                  var pos_y = sum_y/nr_beacons;
                  console.log(pos_x, pos_y);
                  sLocation ='POINT('+pos_x+' '+pos_y+')';
                  //console.log([input.type_id, input.user_id, sLocation, map_row[0].id]);
                  var r_query = connection.query("INSERT INTO report SET type_id=?, user=?, location=GeomFromText(?), map=? ;",
                    [input.type_id, input.user_id, sLocation, map_row[0].id], function(err, result)
                  {
                    if (err)
                    {
                        console.log("Error inserting : %s ",err );
                        res.json({'status':"QUERY_FAILED"})
                    }
                    else
                    {

                      async.forEach(beacon_rows, function(beacon_row, callback) {
                        //console.log(beacon_row.map, map_row[0].id);
                        if(beacon_row.map == map_row[0].id){
                          var hit_query = connection.query('INSERT INTO hit set beacon=?, report=?, checkpoint = (SELECT id from checkpoint WHERE id = (SELECT checkpoint FROM beacon WHERE id = ?));',[beacon_row.id, result.insertId,beacon_row.id],function(err,hit_resluts)
                          {
                              if(err)
                              {
                                  console.log("Error Selecting : %s ",err );
                              }
                              console.log(hit_query.sql);
                              callback();
                          });

                        }
                        else{
                          callback();
                        }
                      }, function(err) {
                        if (err) return next(err);
                        if(input.type_id == 0){
                          res.json({'status': 1});
                        }
                        else if(input.type_id == 1){
                          //Calculate adjecent companies
                          var width = map_row[0].width;
                          var height = map_row[0].height;
                          var radius = width*0.1;
                          var companies = cache.get("company_list");
                          var adjecent_list = [];
                          async.forEach(companies, function(company, callback) {
                                if(err)
                                {
                                    console.log("Error Selecting : %s ",err );
                                }
                                var xs = 0;
                                var ys = 0;
                                if(company.map == map_row[0].id && company.location){
                                  xs = pos_x - company.location.x;
                                  xs = xs * xs;
                                 
                                  ys = pos_y - company.location.y;
                                  ys = ys * ys;
                                  if(Math.sqrt( xs + ys ) < radius){
                                    console.log(company + " was adjecent");
                                    adjecent_list.push(company);
                                  }
                                }
                                
                                callback();

                          }, function(err) {
                            if (err) return next(err);
                              res.json({'user_location': ""+pos_x+','+pos_y, 'companies': adjecent_list, 'map': map_row[0]})
                          });
                        }
                      });
                    }
                  });
                  console.log(r_query.sql); //get raw query
                });
              }

            });
            console.log(u_query.sql); //get raw query
          }

        });
        console.log(m_query.sql); //get raw query
      }
    });
    console.log(b_query.sql); //get raw query
  });
};
exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    var query = connection.query('SELECT * FROM report ORDER BY timestamp DESC',function(err,rows)
    {
      if(err)
          console.log("Error Selecting : %s ",err );

      res.render('report',{page_title:"Reports",data:rows});
     });
     console.log(query.sql);
  });
};
exports.clear_report = function(req,res)
{
        
   var id = req.params.id;
  
   req.getConnection(function (err, connection) {
      
      connection.query("DELETE FROM hit", function(err, rows)
      {
          
       if(err)
           console.log("Error deleting : %s ",err );
          
        req.getConnection(function (err, connection) {
    
          connection.query("DELETE FROM report", function(err, rows)
          {
              
           if(err)
              console.log("Error deleting : %s ",err );
          
            res.redirect('/fair/report');
               
          });
          
       });
           
      });
      
   });
};