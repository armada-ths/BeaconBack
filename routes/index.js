
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index',{page_title:"Welcome"});
  //res.render('index', { title: 'Armada Beacon system v0.1' });
};
