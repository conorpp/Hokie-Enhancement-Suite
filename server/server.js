
/*

*/
var http = 	require('http'),
    qs = 	require('querystring'),
    fs = 	require('fs'),
    db = 	require('./database'),
    crawler = 	require('./crawler');

var settings = JSON.parse(fs.readFileSync('settings.json'));

var server = http.createServer(function(req, res) { //'connection' listener
  
    res.writeHead(200, {'Content-Type': 'json'});
    
    var data;
    
    req.on('data', function (chunk) {
	data = qs.parse( chunk.toString() );
    });
    
    req.on('end', function(){
	console.log(data);
	if (data.add == 'true') {
	    var t = new Tracker(data);
	    db.add(t);
	    crawler.run(data.GET);
	}else if (data.add == 'false') {
	    db.remove(data);
	}else{
	    console.log('Warning:  http request data missing add field.');
	}
    });
    
    res.end(JSON.stringify({res:'success'}));

}).listen(settings.port);

console.log('server bound on port '+settings.port );






