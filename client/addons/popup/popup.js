/*
    This adds a popup with an iframe to preview any link that is hovered over.
    
*/

/* helper prototypes */
Number.prototype.square = function(){ return this*this; };
Number.prototype.sqrt = function(){ return Math.sqrt(this); };
String.prototype.int = function(){ return parseInt(this); };

$(document).on('ready', function(){    
    
    /* popup iframe when a link is hovered over */
    $('a').on('mouseover', function(ev){
        
        var invert = false;
        if ($( window ).width() - ev.pageX < 300) {
            invert = true;
        }
        var url = P.parseHref(this);
        if (!url) 
            return;
        
        P.wipePopups();
        var pop = P.popup(ev.pageX, ev.pageY, {'invert':invert, "url": url});
        $('body').append(pop.html);
    });
    
    /* remove old iframe popups */
    $(document).on('mousemove', function(ev){
        if (P.lastPopupDistance(ev.pageX, ev.pageY) > 530)
            P.wipePopups();
    });
    $(document).on('click', '.popupX', function(){
        P.wipePopups();    
    });
});


/* main object */
var P = {
    
    _popups:0,
    _saved:[],
    
    /* Returns a popup object but does not add to html document */
    popup:function(x,y, options){
        var p = new Popup(x,y, options);
        this._saved.push(p);
        return p;
    },
    
    /* Deletes all popups */
    wipePopups: function(){
        this._saved = [];
        $('.popup').remove();
    },
    
    /* returns distance in pixels from last popup */
    lastPopupDistance: function(x,y){
        var p;
        try{
        if (!this._saved.length) return 0;
        p = $('#'+this._saved[this._saved.length-1].id);
        var px = p.css('left') || p.css('right'),
            px = px.replace('px','').int();
        var py = p.css('top'),
            py = py.replace('px','').int();
        return ((py - y).square() + (px - x).square()).sqrt();      // see Number prototypes at top.
        }catch(e){console.log('err',p);}
    },
   //'javascript:flexibleWindow("HZSKVTSC.P_ProcComments?CRN=70348&TERM=07&YEAR=2014&SUBJ=ECE&CRSE=2574&history=N","new_win","800","800","300","300","no","no","yes","no")'><b style="font-size:12px;" 
    parseHref: function(obj){
        var href = $(obj).attr('href');
        console.log('href',href);
        if (!href) return null;
        if (href.indexOf('http') != -1 && href.indexOf('https') == -1) {
            return null;                            // Dont bother with http links because they are insecure and get blocked.
        }
        if (href.indexOf('flexibleWindow') != -1 || href.indexOf('javascript') != -1) {
            href = href.replace(/\'/g, '"');
            console.log('split ', href.split('"'));
            return href.split('"')[1];
        }
        else if (href.indexOf('https') != -1) {
            return href;
        }
        return null;
    }
    
};

/* popup object */
var Popup = function(x,y, options){
        options = options || {};
        if (options.invert) 
            x = x - 450;        // css class width
        if (!options.url) {
            return;
        }
        
        this.html = '<div style="position:absolute;left:'+x+'px;top:'+y+'px;" id="popup'+(++P._popups)+'" class="popup">'+
                        '<span class="popupX">X</span>'+
                        '<iframe src="'+options.url+'"></iframe>'+
                    '</div>';
        
        this.id = 'popup'+P._popups;
};

Popup.prototype.remove = function(){
    if ($('#'+this.id).length){
        $('#'+this.id).remove();
        return true;
    }else
        return false;
};


