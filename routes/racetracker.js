exports.list = function(req, res){

    req.getConnection(function(err,connection)
    {
        var checkpoint_query = connection.query('SELECT * FROM checkpoint',function(err,checkpoint_rows)
        {
            var checkpoint_list = [];
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
     		else
     		{
     			for (var i in checkpoint_rows)
                {
     				var actions_query = connection.query('SELECT * FROM action WHERE beacon_id IN (SELECT id FROM beacon WHERE checkpoint_id='+checkpoint_rows[i].id+') GROUP BY event_assoc_id',function(err,action_rows)
    		        {
    		            if(err)
    		            {
    		                console.log("Error Selecting : %s ",err );
    		            }
    		     		else
    		     		{
                            var temp = {'name': checkpoint_rows[i].name, 'passed':action_rows.length};
                            checkpoint_list.push(temp);
    		     		}
    		     		console.log(actions_query.sql);
         			});
         		};
                console.log(checkpoint_list[0]);
                res.render('racetracker',{page_title:"ArmadaLoppet!",data:checkpoint_list});  
     		}
           console.log(checkpoint_query.sql);
        });
     
    });
};
