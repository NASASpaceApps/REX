
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Somethingrather' });
};
exports.ajax = function(req, res){ 
	res.render('ajax', {});
}
exports.overview = function (req, res) {
	res.render('overview', {});
}
exports.sendCoordinates = function (req, res){

}