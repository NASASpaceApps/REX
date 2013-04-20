
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Somethingrather' });
};
exports.ajax = function(req, res){ 
	res.render('ajax', {});
}