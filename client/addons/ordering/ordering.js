/*
    Allows the table of classes to ordered alphabetically or numerically
    by clicking a header on the table.
*/

$(document).on('ready', function(){     // need to wait for DOM to be done reliably.
    
    O.indexTable();
    O.loadTable();
    console.log(O.data);
    var lastIndex = -1;
    $('td.sortable').on('click', function(){
        var index = $(this).attr('id').replace('header','').int();      // prototype in popup.js
        
        // toggle ascending/descending
        if (index == lastIndex) {
            O.sort(index, -1);
            lastIndex = -1;
        }else{
            O.sort(index, 1);
            lastIndex = index;
        }
        O.refresh();
        O.highlightHeader(index);
    });
    
});


var O = {
    
    data:[],
    
    table: $('table.dataentrytable'),
    rowSelector: 'tr:not(tr[bgcolor][valign])',
    headerSelector:'tr[bgcolor][valign]',
    
    header:null,

    /* index the table headers */
    indexTable: function(){
        this.header = this.table.find(this.headerSelector);
        var self = this;
        this.header.find('td').each(function(i){
            $(this).attr('id', 'header' + i);
            $(this).addClass('sortable');
        });
    },
    
    /* Load the table into memory */
    loadTable: function(){
        var self = this;
        var rows = this.table.find('tr:not(tr[bgcolor][valign])');
        this.data = [];
        rows.each(function(i){
            self.data[i] = [];
            var r = $(this);
            r.find('td').each(function(){
                self.data[i].push($(this));
            });
            if (r.text().indexOf('Additional Times') != -1) 
                self.combine(self.data.length-2,self.data.length-1);
            
        });
    },
    
    /* Sort the data in memory */
    sort: function(index, invert){
        
        this.data.sort(function(a,b){
            try{
                var aText = a[index].text().replace('* Additional Times *',''),
                    bText = b[index].text().replace('* Additional Times *',''),
                    aNum  = parseInt(aText),
                    bNum  = parseInt(bText);
                
                if ((!isNaN(aNum)) && (!isNaN(bNum))) 
                    aText = aNum, bText = bNum;
                
                if (aText > bText)
                    return 1 * invert;
                else if (bText > aText) 
                    return -1 * invert;
                
                return 0;       // equal
            
            }catch(e){   return -1;   }  
        });
    },
    
    /* Reload the table based on data in memory */
    refresh: function(){
        this.table.find(this.rowSelector).remove();
        
        for (var i in this.data){
            var row = $('<tr></tr>');
            for (var j in this.data[i])
                row.append(this.data[i][j]);
            $(this.table.find('tbody')).append(row);
        }
        
        
    },
    
    /* combines two loaded rows for indexing */
    combine: function(r1, r2){
        for (var i in this.data[r2]) {
            console.log('combing '+r2);
            console.log(this.data[r1][i],this.data[r2][i]);
            if (this.data[r1][i] && this.data[r2][i]){
                this.data[r1][i].html(
                    this.data[r1][i].html()+'<br>'+this.data[r2][i].html()
                );
                this.data[r2][i].remove();
            }
        }
        this.data.splice(r2,1);
    },
    
    
    /* Add highlight CSS to column header */
    highlightHeader: function(index){
        $('.sorted').removeClass('sorted');    
        $('#header'+index).addClass('sorted');
    }
    

    
};

