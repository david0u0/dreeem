var editnote = {};

editnote.width;
editnote.height;
editnote.drawing = false;
editnote.ctx;
editnote.tool = 0;
editnote.textareas;
editnote.pars;
editnote.isNew;
editnote.miniC;
editnote.miniCtx;
editnote.thick = 5;
editnote.curText = null;

function initEdit() {
	editnote.textareas = document.getElementById('textareaDiv');
	editnote.pars = document.getElementById('parDiv');
	editnote.canvas = document.getElementById('note');
	editnote.miniC = document.createElement('canvas');
	editnote.ctx = editnote.canvas.getContext('2d');
	editnote.miniCtx = editnote.miniC.getContext('2d');
	editnote.canvas.onmousedown = function(ev) {
		editnote.ctx.strokeStyle = 'rgb(0, 0, 0)';
		editnote.ctx.lineWidth = editnote.thick;
		if(editnote.tool == 0) {
			var p = getPos(ev, editnote.canvas);
			editnote.drawing = true;
			editnote.initX = p.x;
			editnote.initY = p.y;
			editnote.mem = editnote.ctx.getImageData(0, 0, editnote.width, editnote.height);
		}
		else if(editnote.tool == 1) {
			var p = getPos(ev, editnote.canvas);
			editnote.drawing = true;
			editnote.initX = p.x;
			editnote.initY = p.y;
			editnote.ctx.beginPath();  
			editnote.ctx.moveTo(p.x, p.y);
		}
		else if(editnote.tool == 2) {
			var p = getPos(ev, editnote.canvas);
			editnote.drawing = true;
			editnote.ctx.strokeStyle = editnote.pattern;
			editnote.initX = p.x;
			editnote.initY = p.y;
			editnote.ctx.beginPath();  
			editnote.ctx.moveTo(p.x, p.y);
		}
	}
	editnote.canvas.onmousemove = function(ev) {
		if(!editnote.drawing) return;
		var p = getPos(ev, editnote.canvas);
		
		if(editnote.tool == 0) {
			editnote.ctx.putImageData(editnote.mem, 0, 0);
			editnote.ctx.strokeRect(editnote.initX, editnote.initY, p.x-editnote.initX, p.y-editnote.initY);
		}
		else if(editnote.tool == 1 || editnote.tool == 2) {
			editnote.ctx.lineTo(p.x, p.y);
			editnote.ctx.stroke();
			editnote.initX = p.x;
			editnote.initY = p.y;
		}
	}
	editnote.canvas.onmouseup = function(ev) {
		if(editnote.tool == 0 && editnote.drawing) {
			var p = getPos(ev, editnote.canvas);
			editnote.ctx.putImageData(editnote.mem, 0, 0);
			var tmp = standardForm(p.x, p.y, editnote.initX, editnote.initY);
			createText(tmp.x, tmp.y, tmp.w, tmp.h, null);
		}
		editnote.drawing = false;
	}
	editnote.canvas.onmouseout = function(ev) {
		if(editnote.drawing) {
			var p = getPos(ev, editnote.canvas);
			if(p.x<0 || p.x>editnote.width || p.y<0 || p.y>editnote.height) { //越界判斷
				editnote.drawing = false;
				if(editnote.tool == 0) {
					editnote.ctx.putImageData(editnote.mem, 0, 0);
				}
				return;
			}
		}
	}
}
function edit(n, isNew, curImg) {
	editnote.width = n.width();
	editnote.height = n.height();
	editnote.note = n;
	editnote.isNew = isNew;
	setCss();
	var tmp = document.getElementById('edit');
	tmp.style.display = 'block';
	tmp.style.width = document.body.scrollWidth;
	tmp.style.height = document.body.scrollHeight;
	
	if(!isNew) {
		editnote.ctx.drawImage(n.data, 0, 0);
		if(n.note()) editnote.pattern = editnote.ctx.createPattern(noteImg, "repeat");
		else editnote.pattern = editnote.ctx.createPattern(n.data, "repeat");

		var cur = n.textHead.next;
		while(cur != null) {
			createText(cur.x, cur.y, cur.w, cur.h(), cur);
			cur = cur.next;
		}
		setTool(0);
	}
	else {
		if(curImg) {
			editnote.ctx.fillStyle = 'white';
			editnote.ctx.fillRect(0, 0, n.width(), n.height());
			if(n.width()>12 && n.height()>12) editnote.ctx.drawImage(curImg, 6, 6, n.width()-12, n.height()-12);
			tmp = new Image();
			tmp.onload = function() {
				editnote.pattern = editnote.ctx.createPattern(tmp, "repeat");
			};
			tmp.src = editnote.canvas.toDataURL();
		}
		else {
			editnote.ctx.drawImage(noteImg, 0, 0);
			editnote.pattern = editnote.ctx.createPattern(noteImg, "repeat");
		}
	}
}
function saveNote() {
	editnote.note.data.onload = function() {
		editnote.miniCtx.drawImage(editnote.note.data, 0, 0, editnote.note.miniW(), editnote.note.miniH());
		for(var i = a.length-1; i >= 0; i--) a[i].save();
		editnote.note.mini.src = editnote.miniC.toDataURL();
	}
	editnote.note.mini.onload = function() {
		addNote(editnote.note, editnote.isNew);
		closeNote();
	}
	var a = editnote.textareas.childNodes;
	editnote.note.data.src = editnote.canvas.toDataURL();
}
function createText(x, y, w, h, textBlock) {
	var ta = document.createElement('textarea');
	var p = document.createElement('p');
	editnote.textareas.appendChild(ta);
	editnote.pars.appendChild(p);
	ta.style.left = x;
	ta.style.top = y;
	ta.style.width = w;
	ta.style.height = h;
	p.style.left = x;
	p.style.top = y;
	p.style.width = w;
	if(!textBlock) { 
		textBlock = new TextBlock(x, y, w);
		editnote.note.newText(textBlock);
		textBlock.fontSize = editnote.thick*5;
	}
	ta.value = textBlock.text;
	ta.style.fontSize = textBlock.fontSize;
	p.style.fontSize = textBlock.fontSize;
	(function(textBlock, ta, p) {
		ta.setValue = function(v) {
			if(v) ta.value = v;
			p.innerHTML = escape(ta.value);
			if(ta.value.search(/\S/) == -1) ta.style.display = 'none';
		}
		ta.save = function() {
			var ratio = editnote.width/editnote.note.miniW();
			if(ta.value.search(/\S/) == -1) textBlock.destroy();
			else {
				textBlock.text = ta.value;
				textBlock.fontSize = parseInt(ta.style.fontSize);
				editnote.miniCtx.font = textBlock.fontSize/ratio+"px 微軟正黑體";
				var a = textBlock.split();
				for(var i = 0; i < a.length; i++) {
					editnote.miniCtx.fillText(a[i], textBlock.x/ratio, textBlock.y/ratio+textBlock.fontSize/ratio*(i+1));
				}
			}
		}
		ta.onfocus = function() {editnote.curText = ta;};
		//ta.onblur = function() {editnote.curText = null;};
		ta.setThick = function(th) {
			ta.style.fontSize = th;
			p.style.fontSize = th;
		}
		p.onmousedown = function(ev) {editnote.canvas.onmousedown(ev);};
		p.onmousemove = function(ev) {editnote.canvas.onmousemove(ev);};
		p.onmouseup = function(ev) {editnote.canvas.onmouseup(ev);};
	})(textBlock, ta, p);
}

function setTool(t) {
	if(editnote.tool == 0 && t != 0) {
		editnote.textareas.style.display = 'none';
		var a = editnote.textareas.childNodes;
		for(var i = a.length-1; i >= 0; i--) a[i].setValue();
		editnote.curText = null;
	}

	if(t == 0) editnote.textareas.style.display = 'block';
	editnote.tool = t;
}
function setThick(v) {
	editnote.thick = v*20;
	if(editnote.curText) editnote.curText.setThick(v*100);
}

function setCss() {
	editnote.canvas.width = editnote.width;
	editnote.canvas.height = editnote.height;
	editnote.miniC.width = editnote.note.miniW();
	editnote.miniC.height = editnote.note.miniH();
}
function closeNote() {
	var tmp = document.getElementById('edit');
	tmp.style.display = 'none';
	editnote.textareas.innerHTML = '';
	editnote.pars.innerHTML = '';
	count = 0;
}
