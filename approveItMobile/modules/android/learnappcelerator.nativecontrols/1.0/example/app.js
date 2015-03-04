// This is a test harness for your module
// You should do something interesting in this harness
// to test out the module and to provide instructions
// to users on how to use it by example.

// open a single window
var win = Ti.UI.createWindow({
	backgroundColor : 'white'
});

win.open();

// TODO: write your module tests here
var nativecontrols = require('learnappcelerator.nativecontrols');

var radiogroup = nativecontrols.createRadioGroup({
	width : Ti.UI.SIZE,
	height : Ti.UI.SIZE,
	top : 100,
	left : 10,
	textColor : "",
	selectedIndex : 2,
	layoutType : "vertical",
	buttons : [{
		id : 1,
		text : 'value 11'
	}, {
		id : 2,
		text : 'value 12'
	}, {
		id : 3,
		text : 'value 13'
	}]
});

radiogroup.addEventListener('change', function(e) {
	alert(JSON.stringify(e.result));
	var obj=radiogroup.getSelectedButton();
	Ti.API.info("selected ButtonValue ="+JSON.stringify(obj));
});

win.add(radiogroup);

var Hradiogroup = nativecontrols.createRadioGroup({
	width : Ti.UI.SIZE,
	height : Ti.UI.SIZE,
	top : 350,
	left : 10,
	textColor : "#FF0000",
	selectedIndex : 0,
	layoutType : "horizontal",
	buttons : [{
		id : 1,
		text : 'Male'
	}, {
		id : 2,
		text : 'Female'
	}, {
		id : 3,
		text : 'Mixed'
	}]
});

Hradiogroup.addEventListener('change', function(e) {
	alert(JSON.stringify(e.result));
	var obj=Hradiogroup.getSelectedButton();
	Ti.API.info("selected ButtonValue ="+JSON.stringify(obj));
});

win.add(Hradiogroup);