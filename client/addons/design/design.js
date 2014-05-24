/*
    This changes the design of the time table page
*/


var Sty = {
    
    /* Removes formats needed to be removed with JS */
    removeOldStyles: function(){
        $('style').each(function(){ $(this).remove(); });
        this.addStyleSheet('addons/design/bootstrap/css/bootstrap.min.css');
        this.addStyleSheet('addons/design/bootstrap/css/bootstrap-responsive.min.css');
        this.addStyleSheet('addons/design/design.css');
    },
    
    /* Adds new CSS */
    addNewStyles: function(){
        
        $('button,input[type="submit"]').addClass('btn');           // bootstap btn class 
        
        $('b').css('color','');
        
        var topTable = $('table[style="width:100%;background-color:#660000;padding:7px;"]');
        topTable.css('background-color','#ff6600');      // official VT orange
        topTable.find('b').css('color', '#660000 ');
        
        $('table.dataentrytable').addClass('table');
    },
    
    /* adds a stylesheet from extension */
    addStyleSheet: function(chromeurl){
        var link = '<link rel="stylesheet" type="text/css" href="'
                    +chrome.extension.getURL(chromeurl)+'">';
        $('head').append(link);  
    }
    
};

(function(){
    Sty.removeOldStyles();
    Sty.addNewStyles();
})();