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
     			checkpoint_rows.forEach(function(checkpoint) {
     				
	     			var beacon_query = connection.query('SELECT * FROM beacon WHERE checkpoint_id='+checkpoint.id,function(err,beacon_rows)
			        {
			            if(err)
			            {
			                console.log("Error Selecting : %s ",err );
			            }
			            else
			            {
			            	beacon_rows.forEach(function(beacon)
			            	{
			            		var beacon_query = connection.query('SELECT * MIN(timestamp) FROM action WHERE beacon_id='+beacon.id+"AND type_id=0",function(err,action)
						        {
						            if(err)
						            {
						                console.log("Error Selecting : %s ",err );
						            }
						           
					         	});
			            	});
			     			

			            }
			         });
	     		});
     		}
            res.render('racetracker',{page_title:"ArmadaLoppet!",data:{'checkpoints':checkpoint_list, 'positions': position_list});
                
           console.log(query.sql);
         });
            
    });
  
};
