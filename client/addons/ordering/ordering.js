/*
    Allows the table of classes to ordered alphabetically or numerically
    by clicking a header on the table.
*/

$(document).on('ready', function(){     // need to wait for DOM to be done reliably.
    
    O.indexTable();
    O.loadTable();
    
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
    });
    
});


var O = {
    
    data:[],
    
    table: $('table.dataentrytable'),
    rowSelector: 'tr:not(tr[bgcolor][valign])',
    
    header:null,

    /* index the table headers */
    indexTable: function(){
        this.header = this.table.find('tr[bgcolor][valign]');
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
            $(this).find('td').each(function(){
                self.data[i].push($(this)); 
            });
        });
    },
    
    /* Sort the data in memory */
    sort: function(index, invert){
        
        this.data.sort(function(a,b){
            
            var aText = a[index].text(),
                bText = b[index].text(),
                aNum  = parseInt(aText),
                bNum  = parseInt(bText);
            
            if ((!isNaN(aNum)) && (!isNaN(bNum))) 
                aText = aNum, bText = bNum;
            
            if (aText > bText)
                return 1 * invert;
            else if (bText > aText) 
                return -1 * invert;
            
            return 0;       // equal
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
        
        
    }
    

    
};

