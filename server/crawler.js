

/*
    The tracker and mailing loop
*/

module.exports = 
(function(){
    
var nodemailer =    require("nodemailer"),
    http =          require("http"),
    T =             require('child_process'),
    fs =            require('fs'),
    settings =      JSON.parse(fs.readFileSync('settings.json'));

var loop = {
    
    
    _init: function(){
        
    },
    
    run: function(GET){
        var cmd = 'curl'+
               ' -e "https://scholar.vt.edu/portal/tool/de0a0643-b726-44d1-800d-c4ad61869275/jsf/index/mainIndex"'+
               ' -b "TESTID=set; __utma=6560289.985037697.1399655399.1399655399.1399655399.1; __utmb=6560289.4.10.1399655399; __utmc=6560289; __utmz=6560289.1399655399.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none)"'+
               ' -A "Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10"'+
               ' "https://banweb.banner.vt.edu/ssb/prod/'+GET+'"';
        console.log('running cmd '+cmd);
        T.exec(cmd, function(err, stdout, stderr){
                    
            console.log('CURL:  ', stdout);
        });
    }


};

loop._init();

return loop;

})();