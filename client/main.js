
$(document).on('ready', function(){    
        
    var table = $('.dataentrytable');
    S.getEmail(function(d){
        
        if (! d.email) {
            d.email = window.prompt("Please enter your email to use the class tracking feature. \n\n This can"+
                            " be turned off by disabling the Hokie Enhancement Suite Crome extension.",
                            "");
            alert("You can change your email anytime by clicking on the Extension Icon.");
            S.setEmail(d.email);
        }
        console.log('email is ', d);
        S.email = d.email;
    });
    if (table.length) {
        S.findEntries(table);
    }else{
        console.log('No table was found');
    }
    
});

var S = {
    
    table:null,
    header:null,
    rowTotal:0,
    email:null,
    
    _settings: {
        startIndex:1,
        emailTdClass:'emailWhenOpen',
        trackButtonClass:'trackMe',
        untrackButtonClass:'untrackMe'
    },
    
    /* scrap the table */
    findEntries: function (table){
        if (!table) {
            console.log('ERROR:  findEntries was not supplied with a table.');
            return;
        }
        this.table = $(table);
        this.getHeader();
        
        var rows = table.find('tr:not([bgcolor])');
    
        var safety = 0;
        rows.each(function(ri){
            if (safety) 
                return;
            
            var d = new Entry(this);
        });
       
    },
    
    getEmail: function(cb){
        chrome.storage.local.get("email", function(data) {
            if (!chrome.runtime.lastError) {
                if (cb) cb(data);
            } else {
                console.error("ERROR: could not retrieve email!");
                if (cb) cb();
            }
        });
    },
    setEmail: function(email, cb){
        chrome.storage.local.set({email:email}, function(data) {
            if (!chrome.runtime.lastError) {
                if (cb) cb(data);
            } else {
                console.error("ERROR: could not retrieve email!");
                if (cb) cb();
            }
        });
    },
    
    /* Header for table header storage. this will be changed dynamically. */
    __map : {
        1: {type:'CRN'}, 2: {type:'Course'}, 3: {type:'Title'},
        4: {type:'Type'}, 5: {type:'Credit Hours'}, 6: {type:'Seats'},
        7: {type:'Capacity'}, 8: {type:'Instructor'}, 9: {type:'Days'},
        10: {type:'Begin'}, 11: {type:'End'}, 12: {type:'Location'},
        13: {type:'Exam'}
    },
    
    /*
        Dynamically store table header data
    */
    getHeader: function() {
        this.header = this.table.find('tr[bgcolor][valign]');
        console.log('HEADER' , this.header);
        var i = this._settings.startIndex;
        this.header.find('td').each(function(){
            var text = $(this).text().replace(/\?/g,''),
                text = $.trim(text);
            S.__map[i] = {type:text};
            i++;
        });
        var title = 'if you check this, than you will recieve an email when this class receives an opening.'
        var c = '<td title="'+title+'" class="'+this._settings.emailTdClass+'">'+'Email when spot opens?'+'</td>';
        this.header.prepend(c);
    },
    
    send: function(email, add, crn, GET){
        var data = { email: email, add: add, crn:crn, GET:GET };
        console.log('sending ', data);
        $.ajax({
          type: 'POST',
          url: 'http://localhost:8000',
          data: data,
          dataType:'json',
          success:function(data){
            console.log('received repsonse ', data);
          },
          error:function(){
            console.log('request failed');
            
          }
        });
    }
}

/* scrap a row */
function Entry(tr) {
    this.row = $(tr);
    var tds = this.row.find('td');
    if (tds.length < 9) {
        return;
    }
    var self = this;
    
    self.i = S._settings.startIndex;
    self.map = {};
    for (var m in S.__map){
        self.map[m] = {};
        for (var j in S.__map[m]){
            self.map[m][j] = S.__map[m][j];
        }
    }
    self.map.row = this.row;
    self.id = S.rowTotal++;

    tds.each(function(i){
        if ($(this).hasClass(S._settings.emailTdClass))    // dont count added column.
            return;
        
        if (! self.map[self.i])
            return;
        self.map[self.i].text = $.trim($(this).text());
        self.map[self.i].html = $(this).html();
        self.i++;
    });
    if ($.trim( self.map[1].text )) {
        self.addCheckbox();
    }
    
    return self;
}


/* Print out the contents of scrapped row */
Entry.prototype.print = function(){
    console.log(this.map);
}

/* Print out the contents of scrapped row */
Entry.prototype.addCheckbox = function(){
    var c = '<td class="'+S._settings.emailTdClass+'">' +
                '<button class="'+S._settings.trackButtonClass+'" id="entry'+this.id+'">Track</button>' +
            '</td>';
    c = $(c);
    $(this).unbind('click');
    c.on('click', sendEmail(this.map));
    
    if (this.row.find('.'+S._settings.emailTdClass).length) {
        this.row.find('.'+S._settings.emailTdClass).html(c);
    }else
        this.row.prepend(c);
}

/* Prompt for user confirmation and send ajax request to add tracker. */
function sendEmail(map) {
    return function(){
        var crn = map[1].text;
        var text = map[2].text;
        var GET = $($(map[1].html).siblings('a')[0]).attr('href').split("\"")[1];

        console.log('GET: ', GET);
        var r=confirm("Are you sure you want be emailed when a spot opens up for " +
                      text+'  CRN: '+crn+'?  You will be sent a confirmation email.');
        if (!r) 
            return;
        $(this).unbind('click');
        var untrack = $('<button class="'+S._settings.untrackButtonClass+'" id="untrack'
                        +this.id+'">untrack</button>');
        untrack.on('click', function(){
            new Entry(map.row);
            S.send(S.email, false, crn, GET);
        });
        $(this).html(untrack);
        S.send(S.email, true, crn, GET);
    }
}





