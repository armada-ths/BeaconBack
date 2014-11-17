exports.list = function(req, res)
{
  req.getConnection(function(err,connection)
  {
    res.render('fair',{page_title:"OverWatch"});
  });
}

exports.list_api = function(req, res)
{
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM map',function(err,rows)
		{
		    if(err)
		    {
		        console.log("Error Selecting : %s ",err );
		        res.json({'status': 'QUERY_FAILED'})
		    }
		    else
		    {
		    	res.json(rows)
		    }
		 });
		 console.log(query.sql);
	});
}

exports.api_get = function(req, res)
{
	var id = req.params.id;
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM map WHERE id =?',id,function(err,rows)
		{
		    if(err)
		    {
		        console.log("Error Selecting : %s ",err );
		        res.json({'status': 'QUERY_FAILED'})
		    }
		    else
		    {
		    	res.json(rows[0])
		    }
		 });
		 console.log(query.sql);
	});
}
