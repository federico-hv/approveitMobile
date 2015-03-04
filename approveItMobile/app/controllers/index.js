var platform;
var touchSound;
var disableSound;

var emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;


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

    /** This function is only for android. It disables de sound on the views  **/

	disableSound = function(){	
		touchSound.disable($.oneOne);
		touchSound.disable($.oneTwoOne);
		touchSound.disable($.oneTwoTwo);
		touchSound.disable($.oneTwoThree);
		touchSound.disable($.twoOne);
		touchSound.disable($.twoTwo);
		touchSound.disable($.twoThree);
		touchSound.disable($.twoFour);
		touchSound.disable($.twoFive);
		touchSound.disable($.twoSix);
		touchSound.disable($.pictureBackground);
		touchSound.disable($.picture);
	}

}




$.index.addEventListener('open',function(){
	switch(platform){
		case 3:
			disableSound();
		break;
	}

	setTexts();
});

$.login.addEventListener('click',function(e){
	var bot = e.source;
	bot.enabled = false;
	
	login();
	
	setTimeout(function(){
		bot.enabled = true;
	},500);
});





/** This functions sets all the texts in the corresponding language **/

function setTexts(){
	$.login.setTitle(L('login'));
	placeHolder();
}

/** This functions takes the values from the inputs to be validated and sent **/

function login(){

	var em = $.email.getValue();
	var pass = $.password.getValue();

	var dataObj = {
		email:em,
		password:pass
	};

	var data = JSON.stringify(dataObj);
	var url = 'http://192.168.0.2:3000/openMobile';

	if(validateData(em,pass))
	{
		sendData(data,url,"POST");
	}
	else
	{
		var dialog = Ti.UI.createAlertDialog({
			    message: L('invalidForm'),
			    ok: L('accept')
		}).show();
	}

}

/** This function validates the data that will be sent to the server **/


function validateData(em,pass){
	if(pass !== null && pass !== undefined)
	{
		if(emailPattern.test(em))
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}


/** This function sends the data to the server after its validation **/

function sendData(data,url,method,callback){

	var newWin = Ti.UI.createView({
		layout:'vertical',
		width:'100%',
		height:'100%',
		zIndex:2
	});
	
	var load = Ti.UI.createImageView({
					duration: 50,
				    repeatCount: 0,
				    top:220,
				    width:'40%',
				    heigth:'20%',
				    images:[
				    	'/images/specific/loading1.png',
				    	'/images/specific/loading2.png',
				    	'/images/specific/loading3.png',
				    	'/images/specific/loading4.png',
				    	'/images/specific/loading5.png',
				    	'/images/specific/loading6.png',
				    	'/images/specific/loading7.png',
				    	'/images/specific/loading8.png'
				    ]
	});
	
	load.start();
	newWin.add(load);			
	$.index.add(newWin);

	switch(platform){
		case 3:
			touchSound.disable(load);
			touchSound.disable(newWin);
		break;
		default:
		break;
	}
	
	
	
	
	
	var url = url;

	var xhr = Ti.Network.createHTTPClient({
		onload: function(e){
			load.stop();
			 $.index.remove(newWin);
			 newWin = null;
			 load = null;
			
			var resp = this.responseText;
			
			if(resp === 'successfulAuth')
			{
				var alertWindow = Titanium.UI.createAlertDialog({
			        message:L('welcome'),
			        cancel:0,
			        buttonNames: [L('enter')]
			    });
			 
			    alertWindow.addEventListener('click', function(ev) {
			    	switch(ev.index) {
			        	case 0:
					    	Ti.App.Properties.setBool('activeUser',true);
					    	openSecondView();
						    
							if (callback) {
						        callback();
						    }
				        break;
			        }
			    });
			    
	    		alertWindow.show();
	    	}
		    else
		    {
		    	var men = L('error');
				var alertWindow = Titanium.UI.createAlertDialog({
			        message:men,
			        cancel:0,
			        buttonNames: [L('accept')]
			    });
			 	    
			    alertWindow.show();
			    
		    }
    		
    		$.email.setValue('');
    		$.password.setValue('');
		    
		}, 
		onerror: function(e){
			load.stop();
			$.index.remove(newWin);
			newWin = null;
			load = null;
			
			var men = L('networkError');
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });
		 	    
		    alertWindow.show();
		},
		onsendstream:function(e){
		},
		ondatastream:function(e){},
		onreadystatechange:function(e){
			switch(this.readyState){
				case 0: //Aplicacion ha creado la variable
				//case 1 está abierto
				//case 2 ha recibido la variable los headers
				//case 3 cuando la variable es llamada con el send
				//case 4 cuando ya se encuentra en el onload
				break;
			}
		},
		timeout:5000
	});

	xhr.open(method,url);
	//xhr.setRequestHeader('enctype', 'multipart/form-data'); -> Usar para envío de imágenes....
	xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);

}


/** This function creates the placeholders on textfields **/

function placeHolder(){

	var email = $.email;
	var password = $.password;
	
	switch(platform){
		case 3:
			email.setHintText(L('user'));
			password.setHintText(L('password'));
		break;
		default:
			var usuPlaceholder = L('user');
			var passPlaceholder = L('password');

			var email = $.email;
			var password = $.password;

			email.textAlign = Titanium.UI.TEXT_ALIGNMENT_CENTER;
			password.textAlign = Titanium.UI.TEXT_ALIGNMENT_CENTER;


			email._hintText = usuPlaceholder;
			email.value = usuPlaceholder;
			 
			email.addEventListener('focus',function(e){
			    if(e.source.value == e.source._hintText){
			        e.source.value = "";
			    }
			});

			email.addEventListener('blur',function(e){
			    if(e.source.value==""){
			        e.source.value = e.source._hintText;
			    }
			});


			password._hintText = passPlaceholder;
			password.value = passPlaceholder;
			 
			password.addEventListener('focus',function(e){
			    if(e.source.value == e.source._hintText){
			        e.source.value = "";
			        e.source.passwordMask = true;
			    }
			});

			password.addEventListener('blur',function(e){
			    if(e.source.value==""){
			        e.source.value = e.source._hintText;
			        e.source.passwordMask = false;
			    }
			});

			password.passwordMask = false;
		break;
	}

}


/** This function opens the second view **/

function openSecondView(){
	$.email.setValue('');
	$.password.setValue('');
	
	var main = Alloy.createController('main').getView();
	

	switch(platform){
		case 3:
			main.open({
				activityEnterAnimation : Ti.App.Android.R.anim.slide_in_right,
		        activityExitAnimation : Ti.Android.R.anim.slide_out_left
			});
		break;
		default:
			main.open({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
		break;
	}
}


/** This function verifies if user is active(preauthenticated). If he is it opens the second view **/

function verifyActiveUser(){
	var isActive = Ti.App.Properties.getBool('activeUser');

	if(isActive !== undefined && isActive !== null)
	{
		if(isActive)
		{
			openSecondView();
		}
	}	
}


$.index.open();

verifyActiveUser();
