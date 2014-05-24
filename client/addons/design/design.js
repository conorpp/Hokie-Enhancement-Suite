/*
    This changes the design of the time table page
*/


$(document).on('ready', function(){    
    console.log('Welcome to Hokie Enhancement Suite!');

    /* update format that requires JS */
    Sty.removeOldStyles();
    Sty.addNewStyles();
});


/* main object */
var Sty = {
    
    /* Removes formats needed to be removed with JS */
    removeOldStyles: function(){
        $('style').each(function(){ $(this).remove(); });
    },
    
    /* Adds new formats needed to be done with JS */
    addNewStyles: function(){
        $('button,input[type="submit"]').addClass('btn');           // bootstap btn class 
        
        $('b').css('color','');
        
        var topTable = $('table[style="width:100%;background-color:#660000;padding:7px;"]');
        topTable.css('background-color','#ff6600');      // official VT orange
        topTable.find('b').css('color', '#660000 ');
    
    }
    
};


