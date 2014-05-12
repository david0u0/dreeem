var bgColor = 'rgb(150, 120, 90)';
var bg;
var width = 900;
var height = 500;
var noteImg;
var layerArray;
var mem;
var mode;
var page;
var draw;
var curP;
var isolate;
var ctx;
var initX, initY;
var drawing = false;
var curImg;
var curNote;

function getPos(ev, obj) {
	var x, y;
	x = y = 0;
	if (obj.offsetParent) {
    	do {
    		x += obj.offsetLeft;
			y += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {x: ev.pageX-x, y: ev.pageY-y};
}
	
function init() {
	initEdit();
	bg = document.getElementById('background');
	page = document.getElementById('page');
	ctx = bg.getContext('2d');

	bg.width = width;
	bg.height = height;
	//draw.width = width;
	//draw.height = height;
	noteImg = new Image();
	mode = 0;
	curP = 1;
	isolate = false;

	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = bgColor;
	ctx.fillRect(4, 4, width-8, height-8);
	layerArray = new LayerArray();

	mem = ctx.getImageData(0, 0, width, height);
	noteImg.onload = function() {
		bg.onmousemove = function(ev) {
			if(mode == 1){
				var p = getPos(ev, bg);
				ctx.putImageData(mem, 0, 0);
				ctx.drawImage(noteImg, p.x, p.y, 125, 150);
			}
			else if(mode == 2 && drawing) {
				var p = getPos(ev, bg);
				ctx.putImageData(mem, 0, 0);
				var tmp = standardForm(initX, initY, p.x, p.y);
				var photo = new Photo(tmp.x, tmp.y, tmp.w, tmp.h);
				ctx.fillRect(tmp.x, tmp.y, tmp.w, tmp.h);
				if(tmp.w > 6 && tmp.h > 6) ctx.drawImage(curImg, tmp.x+3, tmp.y+3, tmp.w-6, tmp.h-6);
			}
			else if(mode == 3 && drawing) {
				var p = getPos(ev, bg);
				ctx.putImageData(mem, 0, 0);
				ctx.drawImage(curNote.mini, p.x, p.y);
			}
		}
		bg.onmouseout = function(ev) {
			if(mode == 1 || mode == 3) {
				ctx.putImageData(mem, 0, 0);
				isolate = true;
				show(layerArray.cur);
				drawing = false;
			}
		}
		bg.onclick = function(ev) {
			var p = getPos(ev, bg);
			if(mode == 0) {
				var note = layerArray.getNote(p.x, p.y, curP, isolate?curP:1);
				if(note) edit(note, false);
			}
			else if(mode == 1) {
				ctx.putImageData(mem, 0, 0);
				var pre = layerArray.cur;
				var note = new Note(p.x, p.y);
				edit(note, true);
			}
			else if(mode == 2 && curImg) {
				if(!drawing) {
					var p = getPos(ev, bg);
					drawing = true;
					initX = p.x;
					initY = p.y;
					ctx.fillStyle = 'white';
					mem = ctx.getImageData(0, 0, width, height);
				}
				else {
					drawing = false;
					var p = getPos(ev, bg);
					ctx.putImageData(mem, 0, 0);
					var tmp = standardForm(initX, initY, p.x, p.y);
					var photo = new Photo(tmp.x, tmp.y, tmp.w, tmp.h);
					edit(photo, true, curImg);
				}
			}
			else if(mode == 3) {
				var p = getPos(ev, bg);
				if(!drawing) {
					var note = layerArray.getNote(p.x, p.y, curP, isolate?curP:1);
					if(note) {
						curNote = note;
						isolate = true;
						show(layerArray.cur);
						ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
						ctx.fillRect(curNote.x, curNote.y, curNote.miniW(), curNote.miniH());
						mem = ctx.getImageData(0, 0, width, height);
						drawing = true;
					}
				}
				else {
					curNote.pick();
					curNote.x = p.x;
					curNote.y = p.y;
					addNote(curNote, true);
					isolate = true;
					show(layerArray.cur);
					drawing = false;
				}
			}
			else if(mode == 4) {
				var p = getPos(ev, bg);
				var note = layerArray.getNote(p.x, p.y, curP, isolate?curP:1);
				if(note) {
					note.pick();
					isolate = !isolate;
					show(curP);
				}
			}
		}
	}
	noteImg.src = 'note.jpg';
}
function addNote(note, isNew){
	if(isNew) {
		var pre = layerArray.cur;
		var i = layerArray.addNote(note);
		if(i > pre) page.innerHTML += "<tr><td id='p"+i+"' onclick='show("+i+")'>"+i+"</td></tr>";
		if(curP == pre) {
			ctx.drawImage(note.mini, note.x, note.y);
			if(i > pre) curP++;
			mem = ctx.getImageData(0, 0, width, height);
		}
		else { 
			isolate = true;
			show(layerArray.cur);
		}
	}
	else {
		isolate = !isolate;
		show(curP);
	}
}
function setMode(i) {
	var tmp = document.getElementById('fileIn');
	tmp.style.display = 'none';
	drawing = false;
	mode = i;
	if(i == 0) 	bg.style.cursor = 'help';
	else if(i == 1) bg.style.cursor = 'pointer';
	else if(i == 2) {
		tmp.style.display = 'block';
		bg.style.cursor = 'crosshair';
	}
	else if(i == 3) bg.style.cursor = 'move';
}
function show(num) {
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = bgColor;
	ctx.fillRect(4, 4, width-8, height-8);
	var note;
	if(num == 0) {
		isolate = true;
	}
	else if(curP == num && !isolate) {
		isolate = true;
		layerArray.getLayer(num).draw(ctx);
	}
	else {
		isolate = false;
		for(var i = 1; i <= num; i++) {
			layerArray.getLayer(i).draw(ctx);
		}
	}
	curP = num;
	mem = ctx.getImageData(0, 0, width, height);
}
function loadImg(fileIn) {
	if(fileIn.files[0]) {
		curImg = new Image();
		curImg.onload = function() {
			mode = 2;
			fileIn.style.display = 'none';
		}
		var reader = new FileReader();
		reader.onload = function(evt){ curImg.src = evt.target.result; };
		reader.readAsDataURL(fileIn.files[0]);
	}
}
function min(a, b) {return a>b ? b : a;}
function abs(a) {return a>0 ? a : -a;}
function standardForm(x1, y1, x2, y2) {
	var x = min(x1, x2);
	var y = min(y1, y2);
	var w = abs(x1-x2);
	var h = abs(y1-y2);
	return {x: x, y: y, w: w, h: h};
}