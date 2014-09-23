exports.list = function(req, res){

  req.getConnection(function(err,connection){
       	var checkpoint_count = {}
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
     				checkpoint_dict[checkpoint.name] = 0
     				
	     			var beacon_query = connection.query('SELECT * FROM beacon WHERE checkpoint_id='checkpoint.id,function(err,beacon_rows)
			        {
			            
			            if(err)
			            {
			                console.log("Error Selecting : %s ",err );
			            }
			            else
			            {
			            	var earliest_passed_beacon_at_checkpoint
			            	beacon_rows.forEach(function(beacon))
			            	{
			            		var beacon_query = connection.query('SELECT * MIN(timestamp) FROM action WHERE beacon_id='beacon.id+" type_id=0",function(err,action)
						        {
						            if(err)
						            {
						                console.log("Error Selecting : %s ",err );
						            }
						            else
						            {
						            	if(earliest_passed_beacon_at_checkpoint)
					            		{
					            			if action_rows.timetamp < earliest_passed_beacon_at_checkpoint.timestamp
					            			{
					            				earliest_passed_beacon_at_checkpoint = action
					            			}
					            		}
					            			
						            }
					         	});
			            	}
		            		
			            }
			         });
	     		}
     		}
            res.render('racetracker',{page_title:"ArmadaLoppet!",data:rows});
                
           
         });
         
         console.log(query.sql);
    });
  
};
