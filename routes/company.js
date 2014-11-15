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
      res.render('show_company',{page_title:"company",data:rows});
    });
    console.log(query.sql);
  }); 
};

exports.placement = function(req, res){
  req.getConnection(function(err,connection){
    var checkpoint_query = connection.query('SELECT * FROM company',function(err,company_rows)
    {
      if(err)
          console.log("Error Selecting : %s ",err );
      else{
        var map_query = connection.query('SELECT * FROM map',function(err,map_rows)
        {
          if(err)
              console.log("Error Selecting : %s ",err );
          else{
            res.render('place_company',{page_title:"Place Companies",companies:company_rows, maps:map_rows});          
          }
        });  
      }    
    });
  });
};

exports.save_placement = function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    req.getConnection(function (err, connection) {
        var data = {
            location      : 'POINT('+input.pos_x+' '+input.pos_y+')',
            map           : input.map_select
        };
        console.log(input);
        var query = connection.query("UPDATE company set location = GeomFromText(?), map = ? WHERE id = ? ",[data.location, data.map, input.company], function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         console.log(rows);
          res.redirect('/fair/company');
          
        });
        
       console.log(query.sql); //get raw query
    
    });
};