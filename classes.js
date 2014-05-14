function TextBlock(x, y, w) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.text = '';
	this.fontSize;
	this.split = function() {
		var re = [];
		var tmp = this.text.split(/\n/);
		var n = Math.floor(this.w/this.fontSize);
		for(var i = 0; i < tmp.length; i++) {
			var j;
			var max = Math.floor(tmp[i].length/n);
			for(j = 0; j < max; j++) {
				re.push(tmp[i].slice(j*n, (j+1)*n));
			}
			re.push(tmp[i].slice(j*n, tmp[i].length));
		}
		return re;
	}
	this.h = function(){
		var size = this.fontSize;
		return Math.floor(this.text.length*size/w+2)*size;
	}
	this.escape = function() {
		return escape(this.text);
	}
	this.destroy = function() {
		this.pre.next = this.next;
		if(this.next) this.next.pre = this.pre;
	}
}
function Sticker(x, y) {
	this.userId;
	this.userId;
	this.timeStamp;
	this.x = x;
	this.y = y;
	this.data = new Image();
	this.mini = new Image();
	this.textHead = {next: null};
	this.checkOverlap = function(note) {
		if(note.x >= this.x) {
			if(note.y < this.y) {
				if(note.x > this.x+this.miniW()) return false;
				else if(note.y+note.miniH() < this.y) return false;
				else return true;
			}
			else {
				if(note.x > this.x+this.miniW()) return false;
				else if(note.y > this.y+this.miniH()) return false;
				else return true;
			}
		}
		else return note.checkOverlap(this);
	}
	this.newText = function(text) {
		text.next = this.textHead.next;
		text.pre = this.textHead;
		if(this.textHead.next) this.textHead.next.pre = text;
		this.textHead.next = text;
	}
	this.pick = function() {
		this.pre.next = this.next;
		if(this.next) this.next.pre = this.pre;
		this.next = null;
	}
	this.setMini = function(canvas, fx) {
		canvas.width = this.miniW();
		canvas.height = this.miniH();
		var ctx = canvas.getContext('2d');
		ctx.drawImage(this.data, 0, 0, this.miniW(), this.miniH());
		var cur = this.textHead.next;
		var ratio = this.width()/this.miniW();
		while(cur) {
			ctx.font = cur.fontSize/ratio+"px 微軟正黑體";
			var a = cur.split();
			for(var i = 0; i < a.length; i++) {
				editnote.miniCtx.fillText(a[i], cur.x/ratio, cur.y/ratio+cur.fontSize/ratio*(i+1));
			}
			cur = cur.next;
		}
		this.mini.onload = fx;
		this.mini.src = canvas.toDataURL();
	}
}
function Photo(x, y, miniW, miniH) {
	var self = new Sticker(x, y);
	var w = miniW*4;
	var h = miniH*4;
	if(w > 900) {
		h = Math.floor(h*900/w);
		w = 900;
	}
	if(h > 500) {
		w = Math.floor(w*500/h);
		h = 500;
	}
	self._miniW = miniW;
	self._miniH = miniH;
	self.w = w;
	self.h = h;
	self.miniH = function() {return this._miniH;};
	self.miniW = function() {return this._miniW;};
	self.width = function() {return this.w;};
	self.height = function() {return this.h;};
	self.note = function() {return false;};
	return self;
}
function Note(x, y, pre) {
	var self = new Sticker(x, y);
	self.width = function() {return 500;}
	self.height = function() {return 600;}
	self.miniW = function() {return 125;}
	self.miniH = function() {return 150;}
	self.note = function() {return true;};
	return self
}
function Layer() {
	this.active = true;
	//this.a = new Array();
	this.head = {next: null};
	this.checkOverlap = function(note) {
		var cur = this.head.next;
		while(cur) {
			if(cur.checkOverlap(note)) {
				return true;
			}
			cur = cur.next;
		}
		return false;
	}
	this.getNote = function(x, y) {
		var cur = this.head.next;
		while(cur) {
			if(x > cur.x && x < cur.x+cur.miniW()) {
				if(y > cur.y && y < cur.y+cur.miniH()) return cur;
			}
			cur = cur.next;
		}
		return null;
	}
	this.addNote = function(note) {
		note.next = this.head.next;
		note.pre = this.head;
		if(this.head.next) this.head.next.pre = note;
		this.head.next = note;
	}
	this.draw = function(ctx) {
		cur = this.head.next;
		while(cur) {
			ctx.drawImage(cur.mini, cur.x, cur.y);
			cur = cur.next;
		}
	}
}
function LayerArray() {
	this.a = [null, new Layer()];
	this.cur = 1;
	this.addNote = function(note) {
		for(var i = this.cur; i > 0; i--) {
			if(this.a[i].checkOverlap(note)) break;
		}
		if(i == this.cur) {
			this.a[++this.cur] = new Layer();
		}
		this.a[i+1].addNote(note);
		return i+1;
	}
	this.activate = function(i, active) {
		this.a[i].active = active;
	}
	this.getNote = function(x, y, max, min) {
		for(var i = max; i >= min; i--) {
			var note = this.a[i].getNote(x, y);
			if(note) return note;
		}
		return null;
	}
	this.getLayer = function(i) {
		return this.a[i];
	}
}
function escape(s) {
	s = s.replace(/ /g, '&nbsp;');
	s = s.replace(/</g, '&lt;');
	s = s.replace(/>/g, '&gt;');
	s = s.replace(/\n/g, '</br>');
	return s;
}