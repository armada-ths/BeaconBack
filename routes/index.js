
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index',{page_title:"Armada Beacon System v0.1"});
  //res.render('index', { title: 'Armada Beacon system v0.1' });
};

