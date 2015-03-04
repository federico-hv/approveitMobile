var args = arguments[0] || {};

var touchSound;
var disableSound;



if (Ti.Platform.osname === 'ipad' ) {
    // we are on android
    // use Titanium.Platform.displayCaps to get the screen size
    platform = 1;

}
 
else if ( Ti.Platform.osname === 'iphone' ) {
    // ....
    platform = 2;
}
 
else if ( Ti.Platform.osname === 'android') {
    // ....
    platform = 3;

    touchSound = require('com.gstreetmedia.androidtouchsound');

    disableSound = function(){
		touchSound.disable($.one);
		touchSound.disable($.oneOne);
		touchSound.disable($.oneTwo);
		touchSound.disable($.viewTitle);
		touchSound.disable($.oneThree);
		touchSound.disable($.two);
		touchSound.disable($.three);
	}

}






/** Event listeners for the static elements **/

$.main.addEventListener('open',function(){
	
	switch(platform){
		case 3:
			disableSound();
		break;
		default:
		break;
	}
	setTexts();
	//Alloy.Globals.connectSocket();
});


$.formButton.addEventListener('click',function(e){
	var bot = e.source;
	bot.enabled = false;
	
	openForm();
	
	setTimeout(function(){
		bot.enabled = true;
	},500);
});

$.close.addEventListener('click',function(e){
	var bot = e.source;
	bot.enabled = false;
	
	closeSession();
	
	setTimeout(function(){
		bot.enabled = true;
	},500);
});


function setTexts(){
	$.formButton.title = L('formButton');
	$.reportsButton.title = L('reportsButton');
	$.reportsButton.addEventListener('click',workInProgress);
	$.chatButton.title = L('chatButton');
	$.chatButton.addEventListener('click',workInProgress);
	$.viewTitle.setText('Main');
}

function workInProgress(e){
	var bot = e.source;
	bot.enabled = false;
	
	var men = L('workInProgress');
	var alertWindow = Titanium.UI.createAlertDialog({
	    message:men,
	    cancel:0,
	    buttonNames: [L('accept')]
	});
	
	alertWindow.show();	
	
	setTimeout(function(){
		bot.enabled = true;
	},500);
}

/** This function opens the form view **/

function openForm(){
	var form = Alloy.createController('form').getView();
	
	switch(platform){
		case 3:
			form.open({
				activityEnterAnimation : Ti.App.Android.R.anim.slide_in_right,
		        activityExitAnimation : Ti.Android.R.anim.slide_out_left
			});
		break;
		default:
			form.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
		break;
	}

	
}


/** This function deletes the activeUser and closes the survey view **/

function closeSession(){
	
	var men = L('nosession')+'?';
	var alertWindow = Titanium.UI.createAlertDialog({
        message:men,
        cancel:1,
        buttonNames: [L('accept'),L('cancel')]
    });
 
    alertWindow.addEventListener('click', function(ev) {
    	switch(ev.index) {
        	case 0:
	            Ti.App.Properties.removeProperty('activeUser');
				
				switch(platform){
					case 3:
						$.main.close({
							activityEnterAnimation : Ti.App.Android.R.anim.slide_in_right,
		        			activityExitAnimation : Ti.Android.R.anim.slide_out_left
						});
						disableSound = null;
						touchSound = null;
					break;
					default:
						$.main.close({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
					break;
				}
				setTexts = null;
				openForm = null;
				
				args = null;
				//$.main = null;
				//Alloy.Globals.disconnectSocket();
				closeSession = null;
	        break;
	        case 1:
	        break;
 
        }
    });
    
    alertWindow.show();
	
}
