exports.list = function(req, res){

  req.getConnection(function(err,connection){

       	var checkpoint_list = [];

        var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
        {
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
     		else
     		{
     			for(i = 0; i < checkpoint_rows.length; i++)
                {
     				//var actions_query = connection.query('SELECT * FROM action WHERE beacon_id = beacon.id and action_id = 0 INNER JOIN beacon ON beacon_id = '+checkpoint.id,function(err,action_rows)
			        var actions_query = connection.query('SELECT * FROM action WHERE beacon_id IN (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint_rows[i].id+') GROUP BY event_assoc_id',function(err,action_rows)
			        //var beacon_query = connection.query('SELECT * from beacon WHERE checkpoint_id='+checkpoint.id, err, beacon_rows);
			        {
			            if(err)
			            {
			                console.log("Error Selecting : %s ",err );
			            }
			     		else
			     		{
                            //console.log(JSON.stringify(action_rows[0]) + "LENGTH"+action_rows.length +"NAME"+checkpoint.name)
			     			var temp = {'name': checkpoint_rows[i].name, 'passed':action_rows.length};
                            console.log(JSON.stringify(temp));
                            checkpoint_list.push(temp);
			     		}
			     		console.log(actions_query.sql);
	     			});
	     		});
     		}
           console.log(checkpoint_query.sql);
         });
         console.log(checkpoint_list);
         res.render('racetracker',{page_title:"ArmadaLoppet!",data:checkpoint_list});  
    });
};
