

Tracker = function(data){
	if (!data.email || !data.crn) {
		console.log('Tracker Error:  need email and CRN.');
		this.error = true;
		return this;
	}
	this.type = 'tracker'
	this.email = data.email.trim();
	this.crn = data.crn.trim();
	this.created = new Date();
	this.lastUpdated = null;
	return this;
}

String.prototype.trim = function(){
	return this.replace(/\s/g, '');
}

module.exports = 

(function(){

var fs = require('fs');
var T = require('child_process');

var db = {

	filename: 'backup.json',

	list: [],

	/* write backup file if it doesn't already exist.  Otherwise init list from it. */
	_init: function(){
		var self = this;
		T.exec('ls | grep '+this.filename, function(err, stdout, stderr){
			if (!stdout)
				fs.writeFile(self.filename, JSON.stringify( self.list ) );
			else
				self.list = JSON.parse(fs.readFileSync(self.filename));
		});		
	},

	/* Add a new tracker */
	add: function(tracker){
		if (tracker.type != 'tracker'){
			console.log('db Error:  add expected type tracker');
		}
		this.list.push(tracker);
		var self = this;
		this._save();
	},
	
	/* Remove an existing tracker */
	remove: function(data){
		if ( !data.email || !data.crn) {
			console.log('db Error:  remove requires email and crn');
			return;
		}
		data.email = data.email.trim(),
		data.crn   = data.crn.trim();
		var index = 0;
		for (var i in this.list) {
			if (this.list[i].email == data.email && this.list[i].crn == data.crn) {
				this.list.splice(index, 1);
			}
			index++;
		}
		this._save();
		
	},
	
	/* Save backup */
	_save: function(){
		fs.writeFile(this.filename, JSON.stringify(this.list) );
	}
}

db._init();

return db;

})();











