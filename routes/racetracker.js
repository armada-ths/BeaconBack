exports.list = function(req, res){

  req.getConnection(function(err,connection){
       	var checkpoint_list = []
        var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
        {
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
     		else
     		{
     			checkpoint_rows.forEach(function(checkpoint){
     				//var actions_query = connection.query('SELECT * FROM action WHERE beacon_id = beacon.id and action_id = 0 INNER JOIN beacon ON beacon_id = '+checkpoint.id,function(err,action_rows)
			        var actions_query = connection.query('SELECT * FROM action WHERE beacon_id = ALL (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint.id+')',function(err,action_rows)
			        
			        {
			            if(err)
			            {
			                console.log("Error Selecting : %s ",err );
			            }
			     		else
			     		{
			     			checkpoint_list.push({"name": checkpoint.name,"passed":action_rows.length})
			     		}
			     		console.log(actions_query.sql);
	     			});
	     		});
     		}
            res.render('racetracker',{page_title:"ArmadaLoppet!",data:checkpoint_list});
                
           console.log(checkpoint_query.sql);
         });     
    });
};
