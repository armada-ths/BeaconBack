exports.list = function(req, res){

  req.getConnection(function(err,connection){
       	var checkpoint_list = {}
       	var position_list = []
        var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
        {
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
     		else
     		{
     			checkpoint_rows.forEach(function(checkpoint){
     				var actions_query = connection.query('SELECT * FROM action WHERE beacon_id in',function(err,action_rows)
			        {
			            if(err)
			            {
			                console.log("Error Selecting : %s ",err );
			            }
			     		else
			     		{
			     			
			     		}
	     			});
	     		});
     			
     		}
            res.render('racetracker',{page_title:"ArmadaLoppet!",data:checkpoint_list});
                
           console.log(query.sql);
         });
            
    });
  
};
