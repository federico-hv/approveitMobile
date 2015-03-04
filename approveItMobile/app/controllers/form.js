var args = arguments[0] || {};
var touchSound;
var nativecontrols;
var ImageFactory = require('ti.imagefactory');
var radioButton;
var removeSound;


if (Ti.Platform.osname === 'ipad' ) {
    // we are on android
    // use Titanium.Platform.displayCaps to get the screen size
    platform = 1;
    radioButton	= require('/app/lib/tiRadioButton');

}
else if ( Ti.Platform.osname === 'iphone' ) {
    // ....
    platform = 2;
    radioButton	= require('/app/lib/tiRadioButton');
}
else if ( Ti.Platform.osname === 'android') {
	platform = 3;

	touchSound = require('com.gstreetmedia.androidtouchsound');
	nativecontrols = require('learnappcelerator.nativecontrols');


	/** This function removes sound from the views in android **/

	removeSound = function(){
		touchSound.disable($.oneOne);
		touchSound.disable($.oneTwo);
		touchSound.disable($.viewTitle);
		touchSound.disable($.oneThree);
		touchSound.disable($.three);
	}


}






/** VARIABLES DE LOS CONTROLES DEL FORMULARIO **/

var firstname; 
var lastname; 
var chileanId;
var age;
var email;
var address; 
var phone; 
var estadoCivil; 
var sexo; 
var sexOp = L('male');
var birthDate;
var birthDatePicker; 
var fumador;
var picture = null;
var aspW = 0;
var aspH = 0;
var marcoSetPic;
var rotateRight;
var rotateLeft;
var buttonPanel;
var imgView;
var orientPic = 1;
var lado1;
var lado2;
var photoType = 0;
var botonFoto;
var botonGaleria;
var activeButton;
var rutImg = null;
var fechaValida;

var idPattern = /^([1-9]{0,1}[0-9]{1})\.[0-9]{3}\.[0-9]{3}\-[0-9kK]{1}$/;
var phonePattern = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/;
var emailPattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;

var rightTurn = 90;
var leftTurn = -90;
var invalidField = false;


$.loadingView.start();



/** Event listeners for the static elements **/

$.form.addEventListener('open',function(){
	
	switch(platform){
		case 3:
			removeSound();
		break;
		default:
		break;
	}
	
	setTexts();
	createForm();
	placeHolder();
	addEventListeners();
});


switch(platform){
	case 3:
		$.form.addEventListener('android:back',function(){
			checkValues();
		});
	break;
	default:
	break;
}



$.back.addEventListener('click',function(){
	checkValues();
});



$.send.addEventListener('click', organizeAndSend);





function setTexts(){
	$.viewTitle.setText(L('survey'));
	$.send.setTitle(L('send'));
}


/** This function fills the scrollView with views that contain controls **/

//REEMPLAZAR LOS IF POR UN SWITCH Y TRATAR DE EXTERNALIZAR ESTA PARTE

function createForm(){
	
	var scroll = Ti.UI.createScrollView({
		layout:'vertical', 
		showVerticalScrollIndicator:true,
		scrollType:'vertical',
		height:'100%',
		width:'100%'
	});
	
	for(i=0;i<13;i++)
	{
		var view = Ti.UI.createView({
			layout:'vertical',
			backgroundColor:'white',
			borderWidth:1,
			borderColor:'#007690',
			width:'100%',
			height:'220px',
			top:0
		});

		switch(i){
			case 0:
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('firstname')+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
					
					firstname = Ti.UI.createTextField({
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						maxLength:30,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					view.add(firstname);
			break;
			case 1:
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('lastname')+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
					
					lastname = Ti.UI.createTextField({
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						maxLength:30,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					view.add(lastname);
			break;
			case 2:
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('idocument')+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
				
					chileanId = Ti.UI.createTextField({
						keyboardType:Titanium.UI.KEYBOARD_ASCII,
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						maxLength:12,
						focusable:true,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});
				
					view.add(chileanId);
			break;
			case 3:	
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('dateofbirth')+':',
						font:{
					        fontSize: '20%'
						}
					});

					view.add(label);

					
					birthDate = Ti.UI.createTextField({
						keyboardType:Titanium.UI.KEYBOARD_ASCII,
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						focusable:true,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					var minDate = new Date();
					minDate.setFullYear(1900);
					minDate.setMonth(00);
					minDate.setDate(01);
						
					var today = new Date();
					
					
					var setValue = new Date();
					setValue.setFullYear(today.getFullYear());
					setValue.setMonth(today.getMonth());
					setValue.setDate(today.getDate());

					switch(platform){
						case 3:
							birthDatePicker = Ti.UI.createPicker({			
								selectionIndicator:true,
								minDate:minDate,
								value:setValue,
								type:Ti.UI.PICKER_TYPE_DATE,
								backgroundColor:'#007690',
								borderRadius:5,
								borderColor:'black'
							});
						break;
						default:
							birthDatePicker = Ti.UI.createPicker({
							  type:Ti.UI.PICKER_TYPE_DATE,
							  minDate:minDate,
							  value:setValue,
							  top :'30%'
							});
						break;
					}
					
					birthDate.addEventListener('click',showDatePicker);
					
					view.add(birthDate);
									
			break;
			case 4:
					
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('age')+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
					
					age = Ti.UI.createTextField({
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						editable:false,
						focusable:false,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					view.add(age);
					
			break;
			case 5:
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('occupation')+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
					
					occupation = Ti.UI.createTextField({
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						maxLength:30,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					view.add(occupation);
			break;
			case 6:
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:'Email'+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
					
					
					//Email
					email = Ti.UI.createTextField({
						keyboardType:Titanium.UI.KEYBOARD_EMAIL,
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						maxLength:50,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					view.add(email);
			break;
			case 7:
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('address')+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
					
					
					address = Ti.UI.createTextField({
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						maxLength:50,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					view.add(address);
			break;
			case 8:
					var label = Ti.UI.createLabel({
						width:'80%',
						top:10,
						left:35,
						color:'#007690',
						text:L('phone')+':',
						font:{
					        fontSize: '20%'
						}
					});
					
					view.add(label);
					
					phone = Ti.UI.createTextField({
						keyboardType:Titanium.UI.KEYBOARD_PHONE_PAD,
						width:"80%",
						height:"45%",
						font:{
					        fontSize: '20%'
						},
						top:5,
						backgroundColor:'#F0F2F2',
						color:'#007690',
						maxLength:30,
						textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER
					});

					view.add(phone);
			break;
			case 9:
					view.layout = 'horizontal';
					view.borderColor = 'white';

					var label = Ti.UI.createLabel({
						top:35,
						left:35,
						color:'#007690',
						text:L('maritalstatus')+':',
						font:{
					        fontSize: '20%'
						}
					});

					view.add(label);

					estadoCivil = Ti.UI.createPicker({
						top:30,
						left:20,
						font:{
							fontSize:'20%'
						},
						backgroundColor:'#007690',
						borderRadius:5
					});
					estadoCivil.selectionIndicator = true;

					var columna = Ti.UI.createPickerColumn();

					data = [];

					for(j=0;j<5;j++)
					{	
						
						var estado;

						switch(j){
							case 0:
								estado = L('single');
							break;
							case 1:
								estado = L('married');
							break;
							case 2:
								estado = L('divorced');
							break;
							case 3:
								estado = L('widowed');
							break;
							case 4:
								estado = L('separated');
							break;
						}


						data[j]=Ti.UI.createPickerRow({
							title:'  '+estado,
							color:'blue',
							backgroundColor:'orange'
						});
						columna.addRow(data[j]);
					}

					
					estadoCivil.add(columna);
					
					//control.useSpinner = true;
					view.add(estadoCivil);
			break;
			case 10:
					view.layout = 'horizontal';
					

					var label = Ti.UI.createLabel({
						width : Ti.UI.SIZE,  
 						height : Ti.UI.SIZE, 
						top:35,
						left:35,
						color:'#007690',
						text:L('sex')+':',
						font:{
					        fontSize: '20%'
						}
					});

					view.add(label);

					switch(platform){
						case 3:
							sexo = nativecontrols.createRadioGroup({  
								 height:'50%',
								 top:34,  
								 left:25,  
								 textColor:"#007690",  
								 selectedIndex : 2,  
								 layoutType : "horizontal",  
								 buttons : [{  
								  id : 1,  
								  //text : '\u2642'+' m   '
								  text:L('male')
								 }, {  
								  id : 2,  
								  //text : '\u2640 f'
								  text:L('female')
								 }]  
							});

							sexo.addEventListener('change', function(e) {  
							 sexOp=sexo.getSelectedButton().result.value;    
							});
						break;
						default:
							sexo = radioButton.createGroup({
								left:180,
								groupId:1,
								width:'30%', //320
								height:60, //60
								layout:'horizontal',
								radioItemsValue:[L('male'),L('female')],
								radioItemsPadding:'25%',
								radioItemsBackgroundSelectedImage:'/images/specific/radioButtonActive.png',
								radioItemsBackgroundImage:'/images/specific/radioButton.png',
								radioItemsWidth:33,
								radioItemsHeight:34
							});
						break;
					}
					
					  
					view.add(sexo);
			break;
			
			case 11:
					view.layout = 'horizontal';

					var label = Ti.UI.createLabel({
						top:30,
						left:35,
						color:'#007690',
						text:L('smoker')+':',
						font:{
					        fontSize: '20%'
						}
					});

					view.add(label);
				
				
					fumador = Ti.UI.createButton({
				        focusable:false,
				        title : '',
				        top : 33,
				        left : 130,
				        width : 33,
				        height : 33,
				        borderColor : '#666',
				        borderWidth : 2,
				        borderRadius : 3,
				        backgroundColor : '#FFF',
				        backgroundImage : 'none',
				        color : '#fff',
				        valor:false,
				        font : {
				            fontSize : '25%',
				            fontWeight : 'bold'
				        },
				 
				        value : false, //value is a custom property in this casehere.,
				        toggle : function(_value) {
				            this.value = (_value === undefined) ? !this.value : _value;
				            this.backgroundColor = this.value ? '#007690' : '#FFF';
				            this.valor = this.value ? true : false;
				            this.title = this.value ? '\u2713' : '';
				        }
				    });
				 
				    fumador.addEventListener('click', function(e) {
				        e.source.toggle();
				    });
				    
				    
					view.add(fumador);
			break;
			case 12:
					view.layout = 'horizontal';

					lado1 = Ti.UI.createView({
						width:'50%',
						height:'100%',
						layout:'vertical'
					});

					view.add(lado1);

					botonFoto = Ti.UI.createButton({
						id:'btnPhoto',
						title: '\ud83d\udcf7',
						top:20,
					    width:'50%',
					    height: '50%',
					    font:{
							fontSize:'30%'
						},
						borderRadius:5,
						backgroundColor:'#007690'
					});

					botonFoto.addEventListener('click',photoAction);

					lado1.add(botonFoto);

					lado2 = Ti.UI.createView({
						width:'50%',
						height:'100%',
						layout:'vertical'
					});

					view.add(lado2);


					botonGaleria = Ti.UI.createButton({
						id:'btnGallery',
						title: L('opengallery'),
						top:20,
					    width:"50%",
					    height: "50%",
					    font:{
							fontSize:'15%'
						},
						borderRadius:5,
						backgroundColor:'#007690'
					});

					botonGaleria.addEventListener('click',photoAction);

					lado2.add(botonGaleria);
			break;
		}

		switch(platform){
			case 3:
				touchSound.disable(view);
			break;
			default:
			break;
		}

		scroll.add(view);
	}
	
	$.loadingView.stop();
	$.two.remove($.loadingView);
	$.two.add(scroll);	

}



function showDatePicker(){
	
	var fecTest = new Date();
	testing = fecTest.toDateString();
	
	if(!invalidField)
	{
		switch(platform){
			case 3:
				birthDatePicker.showDatePickerDialog({
					callback: function(e) {
					    if (e.cancel) {
					    } else {
							dateRev(e.value);
					    }
					}
				});
			break;
			default:
				var datePickerWindow = Ti.UI.createView({
					layout:'vertical',
					width:'100%',
					height:'100%',
					backgroundColor:'#007690'
				});

				var buttonAccept = Ti.UI.createButton({
					title : L('accept'),
		        	top : '10%',
		        	backgroundImage:'none',
		        	font:{
		        		fontSize:'35%'
		        	}
				});

				buttonAccept.addEventListener('click',function(){
					//birthDate.setValue(birthDatePicker.value.toString().substring(0,10));
					dateRev(birthDatePicker.value);
					datePickerWindow.remove(birthDatePicker);
					datePickerWindow.remove(buttonAccept);
					buttonAccept = null;
					$.form.remove(datePickerWindow);
					datePickerWindow = null;
				});

				var buttonCancel = Ti.UI.createButton({
					title : L('cancel'),
		        	top : '5%',
		        	backgroundImage:'none',
		        	font:{
		        		fontSize:'35%'
		        	}
				});

				buttonCancel.addEventListener('click',function(){
					datePickerWindow.remove(birthDatePicker);
					datePickerWindow.remove(buttonAccept);
					buttonAccept = null;
					$.form.remove(datePickerWindow);
					datePickerWindow = null;
				});

				

				datePickerWindow.add(birthDatePicker);
				datePickerWindow.add(buttonAccept);
				datePickerWindow.add(buttonCancel);
				$.form.add(datePickerWindow);
			break;
		}
	}
}



function dateRev(date){
								
	var fecReference = testing;
	var fec = date;
	var str = fec.toDateString();
	
	
	var ano = fec.getFullYear();
	var mes = (fec.getMonth()+1);
	var dia = fec.getDate();
	
	if(mes<10)
	{
		mes = '0'+mes;
	}
	
	if(dia<10)
	{
		dia = '0'+dia;
	}
	
	var cadFec = ano+'-'+mes+'-'+dia;
	
	//If the value is different from the reference means it has changed. If not
	var hoy = new Date();
	hoy = hoy.toDateString();
	
	if(str !== fecReference)
	{
		testing = str;		
		if(checkDate(fec))
		{
			fechaValida = true;
			birthDate.value = cadFec;
			calculateAge(cadFec);
		}
		else
		{
			birthDate.blur();
			var men = L('dateError');
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });  
		    alertWindow.show();
			fechaValida = false;
		}
	}
	
}





/** This function changes the datePicker value if the user puts a date greater than today's **/

function checkDate(fec){
	
	
	var valor = fec;
	var hoy = new Date();
	
	
	if(valor.getFullYear() > hoy.getFullYear())
	{
		return false;
	}
	else if(valor.getFullYear() < hoy.getFullYear())
	{
		return true;
	}
	else
	{
		//If it gets to this point, the year has the same value
		if(valor.getMonth() > hoy.getMonth())
		{
			return false;
		}
		else if(valor.getMonth() < hoy.getMonth())
		{
			return true;
		}
		else
		{
			//If it gets to this point, the month has the same value
			if(valor.getDate() > hoy.getDate())
			{
				return false;
			}
			else
			{
				//The date is less or equal to today
				return true;
			}
		}
	}
	
	
}




/** This function calculates age according to the date given as parameter **/

function calculateAge(fec){

        var fecha = fec;



        // Si la fecha es correcta, calculamos la edad
        var values=fecha.split("-");
        var dia = values[2];
        var mes = values[1];
        var ano = values[0];

        // cogemos los valores actuales
        var fecha_hoy = new Date();
        var ahora_ano = fecha_hoy.getYear();
        var ahora_mes = fecha_hoy.getMonth()+1;
        var ahora_dia = fecha_hoy.getDate();
        
        // realizamos el calculo
        var ed = (ahora_ano + 1900) - ano;
        if ( ahora_mes < mes )
        {
            ed--;
        }
        if ((mes == ahora_mes) && (ahora_dia < dia))
        {
            ed--;
        }
        if (ed > 1900)
        {
            ed -= 1900;
        }

        // calculamos los meses
        var meses=0;
        if(ahora_mes>mes)
            meses=ahora_mes-mes;
        if(ahora_mes<mes)
            meses=12-(mes-ahora_mes);
        if(ahora_mes==mes && dia>ahora_dia)
            meses=11;

        // calculamos los dias
        var dias=0;
        if(ahora_dia>dia)
            dias=ahora_dia-dia;
        if(ahora_dia<dia)
        {
            ultimoDiaMes=new Date(ahora_ano, ahora_mes, 0);
            dias=ultimoDiaMes.getDate()-(dia-ahora_dia);
        }


        age.setValue(ed);

}



/** This picture takes and returns the picture **/

function takePicture(e){
				
	if(Titanium.Media.isCameraSupported){

		Titanium.Media.showCamera({
			autohide:true,
			success:function(event){
				var cropRect = event.cropRect;    
				aspW = cropRect.width;		
				aspH = cropRect.height;
				photoType = 1;

				setPicOrientation(event.media,orientPic);	

				
			},
			error:function(){
				var men = L('cameraerror');
				var alertWindow = Titanium.UI.createAlertDialog({
			        message:men,
			        cancel:0,
			        buttonNames: [L('accept')]
			    });
			 	    
			    alertWindow.show();
			},
			mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]

		});
	}
	else
	{
		var men = L('cameraNotSupported');
		var alertWindow = Titanium.UI.createAlertDialog({
	        message:men,
	        cancel:0,
	        buttonNames: [L('accept')]
	    });
	 	    
	    alertWindow.show();
	}
}


/** This function opens the image gallery to select a picture **/

function selectPicture(){

	Ti.Media.openPhotoGallery({
		autohide:true,
		success:function(event){			
			if (event.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
				
				switch(platform){
					case 3:
						var cropRect = event.cropRect;
						aspW = cropRect.width;    
						aspH = cropRect.height;	
					break;
					default:
						aspW = 240;    
						aspH = 320;	
					break;
				}
				
				

				photoType = 2;
				
				setPicOrientation(event.media,orientPic);	

				//compressPhoto(event.media);
        	}
        	else
        	{
        		var men = L('imageNotFile');
				var alertWindow = Titanium.UI.createAlertDialog({
			        message:men,
			        cancel:0,
			        buttonNames: [L('accept')]
			    });
			    
			    alertWindow.show();
        	}
		},
		error:function(){
			var men = L('galleryerror');
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });
		 	    
		    alertWindow.show();
		},
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]

	});
}


/** This function creates the view to define the orientation of the image before saving it **/

function setPicOrientation(media,pos){
	if(rightTurn > 270)
	{
		var num = ((rightTurn/90)%4)*90;
		rightTurn = num;
		leftTurn = rightTurn-180;
	}
	
	if(leftTurn < -270)
	{
		var num = ((leftTurn/90)%4)*90;
		leftTurn = num;
		rightTurn = leftTurn+180;
	}
	
	
	var deviceW = Ti.Platform.displayCaps.platformWidth;
	var deviceH = Ti.Platform.displayCaps.platformHeight;
	
	if(deviceW < deviceH)
	{
		var widthPic = Math.round(0.8*deviceW).toString();
	}
	else
	{
		var widthPic = Math.round(0.8*deviceH).toString();
	}
	
	var rel = aspH/aspW;
	
	var heightPic = Math.round(widthPic*rel).toString();
	
		   
   	marcoSetPic = Ti.UI.createView({
		layout:'vertical',
		width:'100%',
		height:'80%',
		top:0,
		backgroundColor:'black'
	});
	
	buttonPanel = Ti.UI.createView({
		layout:'vertical',
		width:'100%',
		height:'20%',
		top:'80%',
		backgroundColor:'black'
	});
	
	
	$.form.add(marcoSetPic);
	$.form.add(buttonPanel);
	
	
	if(pos !== 1)
	{

		var grad = rightTurn-90;
						
		var rot = Ti.UI.create2DMatrix().rotate(grad);
		
		imgView = Ti.UI.createImageView({
			top:100,
			layout:'vertical',
			width:widthPic+'px',
			height:heightPic+'px',
			image:media,
			borderRadius:5,
			borderColor:'white',
			transform:rot
		});

	}
	else
	{
		imgView = Ti.UI.createImageView({
			top:100,
			layout:'vertical',
			width:widthPic+'px',
			height:heightPic+'px',
			image:media,
			borderRadius:5,
			borderColor:'white'
		});
	}

	
	
	marcoSetPic.add(imgView);
	
	
	rotateRight = Ti.UI.createButton({
		backgroundImage:'/images/specific/rotateRight.png',
		width:'12%',
		left:175
	});
	
	
	rotateRight.addEventListener('click',rotRightFunc);
	
		
	rotateLeft = Ti.UI.createButton({
		backgroundImage:'/images/specific/rotateLeft.png',
		width:'12%',
		left:50
	});
	
	
	rotateLeft.addEventListener('click',rotLeftFunc);
	
	
	var saveButton = Ti.UI.createButton({
		width:'12%',
		left:120,
		backgroundImage:'/images/specific/saveButton.png'
	});
	
	
	saveButton.addEventListener('click',saveButFunc);
	
	var deleteButton = Ti.UI.createButton({
		width:'12%',
		left:40,
		backgroundImage:'/images/specific/deleteButton.png'
	});
	
	deleteButton.addEventListener('click',deleteButFunc);
	
	
	
	var lineOne = Ti.UI.createView({
		layout:'horizontal',
		//backgroundColor:'red',
		width:'100%',
		height:'50%'
	});
	
	lineOne.add(rotateLeft);
	lineOne.add(rotateRight);
	
	var lineTwo = Ti.UI.createView({
		layout:'horizontal',
		//backgroundColor:'green',
		width:'100%',
		height:'50%'
	});
	
	lineTwo.add(saveButton);
	lineTwo.add(deleteButton);
	
	buttonPanel.add(lineOne);
	buttonPanel.add(lineTwo);

	switch(platform){
		case 3:
			touchSound.disable(marcoSetPic);
			touchSound.disable(buttonPanel);
			touchSound.disable(imgView);
			touchSound.disable(lineOne);
			touchSound.disable(lineTwo);
		break;
		default:
		break;
	}
}


/** This function gives the functionality to the rotateRight button created in the setPicOrientation view **/

function rotRightFunc(e){
	var bot = e.source;
	bot.enabled = false;
	var rot = Ti.UI.create2DMatrix().rotate(rightTurn);

    var a = Ti.UI.createAnimation({
	    transform:rot,
	    duration: 500,
	    anchorPoint : {
	        x : 0.5,
	        y : 0.5
	    },
	    repeat:1
	});
	
	imgView.animate(a);
	
	rightTurn+=90;
	leftTurn+=90;
	if(orientPic !== 4)
	{
		orientPic++;
	}
	else
	{
		orientPic = 1;
	}
	
	setTimeout(function(){
		bot.enabled = true;
	},500);
	
}


/** This function gives the functionality to the rotateLeft button created in the setPicOrientation view **/

function rotLeftFunc(e){
	var bot = e.source;
	bot.enabled = false;
	var rot = Ti.UI.create2DMatrix().rotate(leftTurn);//.scale(1,1.5);

    var a = Ti.UI.createAnimation({
	    transform:rot,
	    duration: 500,
	    anchorPoint : {
	        x : 0.5,
	        y : 0.5
	    },
	    repeat:1
	});
	
	imgView.animate(a);
	
	leftTurn-=90;
	rightTurn-=90;
	if(orientPic !== 1)
	{
		orientPic--;
	}
	else
	{
		orientPic = 4;
	}
	
	setTimeout(function(){
		bot.enabled = true;
	},500);
	
}


/** This function gives the functionality to the save button created in the setPicOrientation view **/

function saveButFunc(e){
	var bot = e.source;
	bot.enabled = false;
	
	if(photoType !== 0)
	{
		compressPhoto(imgView.getImage());
	}
	
	setTimeout(function(){
		bot.enabled = true;
	},500);
	
	
	bot.removeEventListener('click',saveButFunc);
	rotateRight.removeEventListener('click',rotRightFunc);
	rotateLeft.removeEventListener('click',rotLeftFunc);
	marcoSetPic.remove(imgView);
	$.form.remove(marcoSetPic);
	$.form.remove(buttonPanel);
	imgView = null;
	saveButton = null;
	deleteButton = null;
	rotateRight = null;
	rotateLeft = null;
	lineOne = null;
	lineTwo = null;
	marcoSetPic = null;
	buttonPanel = null;
}


/** This function gives the functionality to the delete button created in the setPicOrientation view **/

function deleteButFunc(e){
	var bot = e.source;
	bot.enabled = false;
	if(picture !== null)
	{
		deletePic(activeButton);
		activeButton = null;
	}
	else
	{
		orientPic = 1;
		rightTurn = 90;
		leftTurn = -90;
	}	
	setTimeout(function(){
		bot.enabled = true;
	},500);
	
	
	bot.removeEventListener('click',deleteButFunc);
	rotateRight.removeEventListener('click',rotRightFunc);
	rotateLeft.removeEventListener('click',rotLeftFunc);
	marcoSetPic.remove(imgView);
	$.form.remove(marcoSetPic);
	$.form.remove(buttonPanel);
	imgView = null;
	saveButton = null;
	deleteButton = null;
	rotateRight = null;
	rotateLeft = null;
	lineOne = null;
	lineTwo = null;
	marcoSetPic = null;
	buttonPanel = null;
}


/** This function calls the camera or gallery depending on the button that was pressed **/

function photoAction(e){	
	var bot = e.source;
	bot.enabled = false;
	var gal = false;
	
	if(bot.id === 'btnGallery')
	{
		gal = true;
		botonFoto.enabled = false;
		selectPicture();
	}
	else
	{
		botonGaleria.enabled = false;
		takePicture();
	}
	
	setTimeout(function(){
		if(gal)
		{
			botonFoto.enabled = true;
		}
		else
		{
			botonGaleria.enabled = true; 
		}
		bot.enabled = true;
	},2000);
}


/** This function returns the photo button to default **/

function funcOnePhotoButton(){
	botonFoto.color = '#FFFFFF';
	lado2.backgroundColor = '#FFFFFF';
	botonGaleria.enabled=true;
	botonFoto.removeEventListener('click',adminSavedPic);
	botonFoto.addEventListener('click',photoAction);
}



/** This function puts the photo button in active state and blocks the gallery button **/

function funcTwoPhotoButton(){
	activeButton = 'btnPhoto';
	botonFoto.color = '#00FF22';
	lado2.backgroundColor = '#E5E5E5';
	botonGaleria.enabled=false;
	botonFoto.removeEventListener('click',photoAction);
	botonFoto.addEventListener('click',adminSavedPic);
}


/** This function returns the gallery button to default **/

function funcOneGalleryButton(){
	botonGaleria.color = '#FFFFFF';
	lado1.backgroundColor = '#FFFFFF';
	botonFoto.enabled=true;
	botonGaleria.removeEventListener('click',adminSavedPic);
	botonGaleria.addEventListener('click',photoAction);
}

/** This function puts the gallery button in active state and blocks the gallery button **/

function funcTwoGalleryButton(){
	activeButton = 'btnGallery';
	botonGaleria.color = '#00FF22';
	lado1.backgroundColor = '#E5E5E5';
	botonFoto.enabled=false;
	botonGaleria.removeEventListener('click',photoAction);
	botonGaleria.addEventListener('click',adminSavedPic);
}



/** This function takes a pic as parameter and compresses it **/

function compressPhoto(foto){
	
	var newBlob;
	var blob = foto;
	
	newBlob = ImageFactory.compress(blob, 0.3);

	if(newBlob.length <= 76640)
	{
		savePhoto(newBlob);	
	}
	else
	{
		var aspecW;
		var aspecH;
		var rel = aspH/aspW;	
		var strRes;
		var go = true;
		var nuImLength; 
		
		if(aspW > 2000 && aspW < 3500)
		{
			aspecW = 1000;
		}
		else if(aspW > 1000 && aspW <= 2000)
		{
			aspecW = 700;
		}
		else if(aspW <= 1000)
		{
			aspecW = 640;
		}
		else
		{
			go = false;
		}
				
		
		if(go === true)
		{
			
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
			
			switch(platform){
				case 3:
					touchSound.disable(load);
					touchSound.disable(newWin);	
				break;
				default:
				break;
			}


			$.form.add(newWin);
			
			do
			{		
				do
				{
					aspecH = aspecW * rel;
					strRes = aspecH.toString();
					aspecW-=1;		
				}while(strRes.indexOf('.')!==-1);
					
				
				var nuIm = ImageFactory.imageAsResized(newBlob, {width:aspecW, height:aspecH, quality:0.3});
	
			}while(nuIm.length > 76640); //this number was really 12188 as I got from the results...
	

			
			load.stop();
			newWin.remove(load);
			load = null;
			$.form.remove(newWin);
			newWin = null;
			newBlob = null;
			blob = null;
			savePhoto(nuIm);
				
		}
		else
		{
			var men = L('imageHeavy');
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });
		 	    
	    	alertWindow.show();
		}
    
	}
	
}


/** This function sets the image variable with the value given as a base64 encoded file **/

function savePhoto(newB){
	try
	{
		
		picture = Ti.Utils.base64encode(newB);

		if(photoType === 1)
		{
			funcTwoPhotoButton();
		}
		else if(photoType === 2)
		{
			funcTwoGalleryButton();
		}
		
		photoType = 0;
	}
	catch(e)
	{
		var men = L('blobError');
		var alertWindow = Titanium.UI.createAlertDialog({
	        message:men,
	        cancel:0,
	        buttonNames: [L('accept')]
	    });
	 	    
	    alertWindow.show();
	}
}


/** This function creates a dialog to ask the user if he wants to view the current pic, delete it or simply cancel this request **/

function adminSavedPic(e){
	
	var men = L('picMessage')+'?';
        	
	var alertWindow = Titanium.UI.createAlertDialog({
        message:men,
        cancel:2,
        buttonNames: [L('picPreview'),L('picDelete'),L('cancel')]
    });
 
    alertWindow.addEventListener('click', function(ev) {
    	switch(ev.index) {
        	case 0:
        		var im = Ti.Utils.base64decode(picture);		
				setPicOrientation(im,orientPic);
	        break;
	        case 1:
	        	deletePic(e.source.id);
	        break;
	        case 2:
	        break;
        }
    });
    
    alertWindow.show();
}

/** This function nulls the loaded image and reset the colors of backgrounds and buttons of the image control **/

function deletePic(id){

	picture = null;
	photoType = 0;
	orientPic = 1;
	rightTurn = 90;
	leftTurn = -90;
	
	if(id === 'btnPhoto')
	{
		funcOnePhotoButton();
	}
	else
	{
		funcOneGalleryButton();
	}	
}

/** This function organizes the data to get validated and sent **/

function organizeAndSend(){

	var nac;

	if(birthDatePicker.value)
	{
		nac = birthDatePicker.value;
	}
	else
	{
		nac = null;
	}

	var nom = firstname.getValue().toLowerCase();
	var ape = lastname.getValue().toLowerCase();
	var ru = chileanId.getValue().toLowerCase();
	var ed = parseInt(age.getValue());
	var ocu = occupation.getValue().toLowerCase();
	var em = email.getValue().toLowerCase();
	var dir = address.getValue().toLowerCase();
	var tel = phone.getValue();
	var es = estadoCivil.getSelectedRow(0).title.trim().toLowerCase();
	var s = sexOp.toLowerCase().trim();
	var sex;

	
	if(s === 'masculino' || s === 'male')
	{
		sex = 'm';
	}
	else
	{
		sex = 'f';
	}
	
	if(es === 'soltero')
	{
		es = 'single';
	}
	else if(es === 'casado')
	{
		es = 'married';
	}	
	else if(es === 'divorciado')
	{
		es = 'divorced';
	}
	else if(es === 'viudo')
	{
		es = 'widowed';
	}
	else if(es === 'separado')
	{
		es = 'separated';
	}
		
	
	//var dia = birthDatePicker.value.getDate();
	//var mes = birthDatePicker.value.getMonth()+1;
	//var anio = birthDatePicker.value.getFullYear();
	
	var fum = fumador.valor;
	
	Ti.Geolocation.purpose = L('geopurpose');
	var coords = {
		latitude:null,
		longitude:null
	};

	Titanium.Geolocation.getCurrentPosition(function(e) {
	    if (!e.success || e.error) {
	        Ti.API.error(JSON.stringify(e.error));
	        var men = 'error ' + JSON.stringify(e.error);
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });
		 	    
		    alertWindow.show();
	 
	        return;
	    }
	 	
	 	coords.latitude = e.coords.latitude;
	 	coords.longitude = e.coords.longitude;

	});

	

	if(validateData(nom,ape,ru,ed,ocu,em,dir,tel,es,sex,nac,fum,coords))
	{
		invalidField = false;
		if(checkNetwork())
		{
			var datos = {
				imagen:picture.toString(),
				orientation:orientPic
			};
	
			if(datos.imagen !== undefined && datos.imagen !== null)
			{
				var data = JSON.stringify(datos);
				var url = 'http://192.168.0.2:3000/images/subirImagenTitanium/';
				var rI;
				
				sendData(data,url,"POST",false,function(e){	
					rutImg = e;
					rI = rutImg;
					url = 'http://192.168.0.2:3000/people/agregarPersonaTitanium/';
					data = createJSON(nom,ape,ru,ed,ocu,em,dir,tel,es,sex,nac,fum,coords);
						
					sendData(data,url,"PUT",true,function(e){
						var men = e;
						var alertWindow = Titanium.UI.createAlertDialog({
					        message:men,
					        cancel:0,
					        buttonNames: [L('accept')]
					    });
					 	    
					    alertWindow.show();

						cleanVariables();
						//Alloy.Globals.socketEmit('refresh');
						
						//url = 'http://192.168.0.2:3000/people/personaPorRutTitanium/'+ru;
						/**
						var obj = {};
						sendData(obj,url,"GET",false,function(e){
							var ob = eval(e);
							
							var personaNueva = ob[0];
							if(personaNueva.fumador === true)
							{
								personaNueva.fumador = 'yes';
							}
							else
							{
								personaNueva.fumador = 'no';
							}
							var fecOriginal = personaNueva.fechaNacimiento;
				            var fecSlice = fecOriginal.slice(0,10);
				            personaNueva.fechaNacimiento = fecSlice;
							

							
							url = 'http://192.168.0.2:3000/images/descargarThumbnail/min'+rI;
							
							setTimeout(function(){
								sendData(obj,url,"GET",false,function(e){
									//alert(e);
									personaNueva.imagen = 'data:image/jpeg;base64,'+e;
									Alloy.Globals.socketEmit('nuevaPersona',personaNueva);
								});
							},1000);
						});**/
					});
				});
			}
			else
			{
				var men = L('imageError');
				var alertWindow = Titanium.UI.createAlertDialog({
			        message:men,
			        cancel:0,
			        buttonNames: [L('accept')]
			    });
			 	    
			    alertWindow.show();
			}
		}
		else
		{
			var men = L('networkError');
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });
		 	    
		    alertWindow.show();
		}
		
		
	}
	
}

/** This function checks if the device is connected to the internet **/

function checkNetwork(){
	
	if(Ti.Network.networkType != Ti.Network.NETWORK_NONE){
		return true;
	}
	else
	{
		return false;
	}
}



/** This function validates the data that is going to be sent to the server **/

function validateData(nom,ape,ru,ed,ocu,em,dir,tel,es,sex,nac,fum,coords){

	var defaultVal = '.....';
	var specialCarac = '@ªº·.¬“”()~`´¡!#$%^&*+=-[]\\\';,/{}|\":<>¿?¨';
	var validFName = true;
	var validLName = true;
	var validOccu = true;
	
	var firArr = nom.split('');
	var lasArr = ape.split('');
	var occuArr = ocu.split('');
	
	/** firstname validation **/
	
	for(i=0;i<firArr.length;i++)
	{
		if(specialCarac.indexOf(firArr[i])!==-1)
		{
			validFName = false;
		}
	}
	
	/** lastname validation **/
	
	for(i=0;i<lasArr.length;i++)
	{
		if(specialCarac.indexOf(lasArr[i])!==-1)
		{
			validLName = false;
		}
	}
	
	/** occupation validation **/
	
	for(i=0;i<occuArr.length;i++)
	{
		if(specialCarac.indexOf(occuArr[i])!==-1)
		{
			validOccu = false;
		}
	}
	
	


	if(nom !== defaultVal && nom !== undefined && nom !== null && validFName == true)
	{
		if(ape !== defaultVal && ape !== undefined && ape !== null && validLName == true)
		{
			if(idPattern.test(ru))
			{
				if(ocu !== defaultVal && ocu !== undefined !== ocu !== null && validOccu == true)
				{
					if(emailPattern.test(em))
					{
						if(dir !== defaultVal && dir !== undefined && dir !== null)
						{
							if(phonePattern.test(tel))
							{
								if(es !== undefined && es !== null && es !== defaultVal)
								{
									if(sex !== defaultVal && sex !== undefined && sex !== null)
									{
										if(nac !== defaultVal && nac !== undefined && nac !== null && fechaValida == true)
										{
											return true;
										}
										else
										{
											var men = L('dateError');
											var alertWindow = Titanium.UI.createAlertDialog({
										        message:men,
										        cancel:0,
										        buttonNames: [L('accept')]
										    });
										 	    
										    alertWindow.show();
											return false;
										}
									}
									else
									{
										var men = L('sexError');
										var alertWindow = Titanium.UI.createAlertDialog({
									        message:men,
									        cancel:0,
									        buttonNames: [L('accept')]
									    });
									 	    
									    alertWindow.show();
										return false;
									}
								}
								else
								{
									var men = L('maritalStatusError');
									var alertWindow = Titanium.UI.createAlertDialog({
								        message:men,
								        cancel:0,
								        buttonNames: [L('accept')]
								    });
								 	    
								    alertWindow.show();
									return false;
								}
							}
							else
							{
								var men = L('phoneError');
								var alertWindow = Titanium.UI.createAlertDialog({
							        message:men,
							        cancel:0,
							        buttonNames: [L('accept')]
							    });
							 	    
							    alertWindow.show();
								return false;
							}
						}
						else
						{
							var men = L('addressError');
							var alertWindow = Titanium.UI.createAlertDialog({
						        message:men,
						        cancel:0,
						        buttonNames: [L('accept')]
						    });
						 	    
						    alertWindow.show();
							return false;
						}
					}
					else
					{
						var men = L('emailError');
						var alertWindow = Titanium.UI.createAlertDialog({
					        message:men,
					        cancel:0,
					        buttonNames: [L('accept')]
					    });
					 	    
					    alertWindow.show();
						return false;
					}
				}
				else
				{
					var men = L('occupationError');
					var alertWindow = Titanium.UI.createAlertDialog({
				        message:men,
				        cancel:0,
				        buttonNames: [L('accept')]
				    });
				 	    
				    alertWindow.show();
					return false;
				}
			}
			else
			{
				var men = L('idError');
				var alertWindow = Titanium.UI.createAlertDialog({
			        message:men,
			        cancel:0,
			        buttonNames: [L('accept')]
			    });
			 	    
			    alertWindow.show();
				return false;
			}
		}
		else
		{
			var men = L('lastNameError');
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });
		 	    
		    alertWindow.show();
			return false;
		}
	}
	else
	{
		var men = L('firstNameError');
		var alertWindow = Titanium.UI.createAlertDialog({
	        message:men,
	        cancel:0,
	        buttonNames: [L('accept')]
	    });
	 	    
	    alertWindow.show();
		return false;
	}

}



/** This function validates the Id on blur **/

function validateId(){
	var idNum = chileanId.getValue();
	
	if(!idPattern.test(idNum) && idNum !== '')
	{
		var men = L('idError');
		var alertWindow = Titanium.UI.createAlertDialog({
	        message:men,
	        cancel:0,
	        buttonNames: [L('accept')]
	    });
	 	    
	    alertWindow.show();
		chileanId.setValue('');
		invalidField = true;
		chileanId.focus();
	}
	else
	{
		invalidField = false;
	}
}


/** This function validates the email on blur **/

function validateEmail(){
	var em = email.getValue();
	
	if(!emailPattern.test(em) && em !== ''){
		var men = L('emailError');
		var alertWindow = Titanium.UI.createAlertDialog({
	        message:men,
	        cancel:0,
	        buttonNames: [L('accept')]
	    });
	 	    
	    alertWindow.show();
		email.setValue('');
		invalidField = true;
		email.focus();
	}
	else
	{
		invalidField = false;
	}
}


/** This function validates the phone on blur **/

function validatePhone(){
	var ph = phone.getValue();
	
	if(!phonePattern.test(ph) && ph !== ''){
		var men = L('phoneError');
		var alertWindow = Titanium.UI.createAlertDialog({
	        message:men,
	        cancel:0,
	        buttonNames: [L('accept')]
	    });
	 	    
	    alertWindow.show();
	    phone.setValue('');
	    invalidField = true;
	    phone.focus();
	}
	else
	{
		invalidField = false;
	}
}


/** This function formats the data into a json object **/	

function createJSON(nom,ape,ru,ed,ocu,em,dir,tel,es,sex,nac,fum,coords){
	
	/**

	alert('NOM: '+(typeof nom));
	alert('APE: '+(typeof ape));
	alert('RU: '+(typeof ru));
	alert('ED: '+(typeof ed));
	alert('OCU: '+(typeof ocu));
	alert('EM: '+(typeof em));
	alert('DIR: '+(typeof dir));
	alert('TEL: '+(typeof tel));
	alert('ES: '+(typeof es));
	alert('SEX: '+(typeof sex));
	alert('NAC ES FECHA: '+(nac instanceof Date));
	alert('FUM: '+(typeof fum));
	alert('COORDSLA: '+(typeof coords.latitude));
	alert('COORDSLO: '+(typeof coords.latitude));
	**/


	var datos = {
		firstname:nom,
		lastname:ape,
		chileanId:ru,
		age:ed,
		occupation:ocu,
		email:em,
		address:dir,
		telephone:tel,
		maritalStatus:es,
		gender:sex,
		birthDate:nac,
		imageRoute:rutImg,
		smoker:fum,
		coordinates:coords
	};

	var data = JSON.stringify(datos);
	//alert(data);

	return data;
}

/** This function creates the http client and sends the json objects to the server **/

function sendData(data,url,method,obj,callback){

	if(obj){
	
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
		$.form.add(newWin);


		switch(platform){
			case 3:
				touchSound.disable(load);
				touchSound.disable(newWin);	
			break;
			default:
			break;
		}
	}

	
	
	var url = url;

	var xhr = Ti.Network.createHTTPClient({
		onload: function(e){
			if(obj){
				 load.stop();
				 $.form.remove(newWin);
				 newWin = null;
				 load = null;
			}

			if (callback) {
		        callback(this.responseText);
		    }
		    
		   
		}, 
		onerror: function(e){
			if(obj){
				 load.stop();
				 $.form.remove(newWin);
				 newWin = null;
				 load = null;
			}
			var men = L('sendingDataError');
			var alertWindow = Titanium.UI.createAlertDialog({
		        message:men,
		        cancel:0,
		        buttonNames: [L('accept')]
		    });
		 	    
		    alertWindow.show();
		},
		onsendstream:function(e){},
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

/** Esta función debería encargarse de eliminar las variables asignadas para que se limpie el formulario **/

function cleanVariables(){
	
	firstname.setValue('');
	lastname.setValue('');
	chileanId.setValue('');
	birthDate.setValue('');
	phone.setValue('');
	occupation.setValue('');
	email.setValue('');
	address.setValue('');
	phone.setValue('');
	age.setValue(0);
	
	
	firstname.blur();
	lastname.blur();
	chileanId.blur();
	occupation.blur();
	email.blur();
	address.blur();
	phone.blur();
	
	
	
	estadoCivil.setSelectedRow(0,0);
	
	sexo.selectedIndex = 2;
	
	if(fumador.valor === true)
	{
		fumador.toggle();
	}

	//alert('active: '+activeButton);
	
	deletePic(activeButton);
	
	
	rutImg = null;
	
}


/** Esta función coloca los placeholder para los textField **/

function placeHolder(){
	
	var placeholderDef = '..........';
	var datePlaceholder = 'yyyy-mm-dd';
	var phonePlaceholder = '+56xxxxxxxxx';
	var rutPlaceholder = 'xx.xxx.xxx-x';
	var agePlaceholder = 0;

	firstname.setHintText(placeholderDef);	 
	lastname.setHintText(placeholderDef);
	birthDate.setHintText(datePlaceholder);
	chileanId.setHintText(rutPlaceholder);
	age.setHintText(agePlaceholder);
	occupation.setHintText(placeholderDef);
	email.setHintText(placeholderDef);
	address.setHintText(placeholderDef);
	phone.setHintText(phonePlaceholder);

}

function addEventListeners(){
	chileanId.addEventListener('blur',validateId);
	
	email.addEventListener('blur',validateEmail);

	phone.addEventListener('blur',validatePhone);
}



function checkValues(){

	var nom = firstname.getValue();
	var ape = lastname.getValue();
	var idRu = chileanId.getValue();
	var occu = occupation.getValue();
	var em = email.getValue();
	var add = address.getValue();
	var ph = phone.getValue();
	var img = picture;
	
	var empt = '';
	var defaultVal = '.....';
	var phonePlaceholder = '+56xxxxxxxxx';
	var rutPlaceholder = 'xx.xxx.xxx-x';
	
	var allEmpty = true;
	
	//if(nom !== placeHolder || ape !== placeHolder || idRu !== rutPlaceholder occu !== placeHolder || em !== placeHolder || add !== placeHolder || ph !== phonePlaceholder || img !== null)
	if(nom !== defaultVal && nom !== empt)
	{
		allEmpty = false;	
	}
	else if(ape !== defaultVal && ape !== empt)
	{
		allEmpty = false;
	}
	else if(idRu !== rutPlaceholder && idRu !== empt)
	{
		allEmpty = false;
	}
	else if(occu !== defaultVal && occu !== empt)
	{
		allEmpty = false;
	}
	else if(em !== defaultVal && em !== empt)
	{
		allEmpty = false;
	}
	else if(add !== defaultVal && add !== empt)
	{
		allEmpty = false;
	}
	else if(ph !== phonePlaceholder && ph !== empt)
	{
		allEmpty = false;
	}
	else if(img !== null)
	{
		allEmpty = false;
	}
	
	
	if(allEmpty)
	{
		closeWindow();
	}
	else
	{
		var alertWindow = Titanium.UI.createAlertDialog({
           //title: 'Warning',
            message: L('confirmClose')+'?',
            cancel:1,
            buttonNames: [L('accept'),L('cancel')]
        });
 
        alertWindow.addEventListener('click', function(ev) {         
        	switch(ev.index) {	           
				case 0:
				   	email.setValue('');
				    chileanId.setValue('');
				    phone.setValue('');
					closeWindow();
				break;
				case 1:
				break;
            }
        });
        
        alertWindow.show();
	}	
	
}




/** This function nulls all the variable and function objects in this document and closes the window **/

function closeWindow(){
	 chileanId.removeEventListener('blur',validateId);
	
	 email.removeEventListener('blur',validateEmail);

	 phone.removeEventListener('blur',validatePhone);
	
	 args = null;
	 
	 ImageFactory = null;
	
	 firstname = null; 
	 lastname = null; 
	 chileanId = null; 
	 age = null;
	 email = null;
	 address = null; 
	 phone = null; 
	 estadoCivil = null; 
	 sexo = null; 
	 sexOp = null;
	 birthDatePicker = null; 
	 fumador = null;  
	 picture = null;
	 marcoSetPic = null;
	 rotateRight = null;
	 buttonPanel = null;
	 imgView = null;
     orientPic = null; 
	 lado1 = null;
	 lado2 = null;
	 botonFoto = null;
	 botonGaleria = null;
	 rutImg = null;
	 fechaValida = null;
	
	 idPattern = null;
	 phonePattern = null;
	 emailPattern = null;
	 
	 rightTurn = null;
     leftTurn = null;
	 
	 
	 /** Functions **/
	 
	 showDatePicker = null;
	 setTexts = null;
	 createForm = null;
	 
	 dateRev = null;
	 checkDate = null;
	 calculateAge = null;
	 
	 takePicture = null;
	 selectPicture = null;
	 setPicOrientation = null;
	 rotRightFunc = null;
	 rotLeftFunc = null;
	 saveButFunc = null;
	 deleteButFunc = null;
	 photoAction = null;
	 funcOnePhotoButton = null;
	 funcOneGalleryButton = null;
	 funcTwoPhotoButton = null;
	 funcTwoGalleryButton = null;
	 compressPhoto = null;
	 savePhoto = null;
	 adminSavedPic = null;
	 deletePic = null;
	 organizeAndSend = null;
	 checkNetwork = null;
	 
	 validateData = null;
	 validateEmail = null;
	 validateId = null;
	 validatePhone = null;
	 
	 createJSON = null;
	 sendData = null;
	 cleanVariables = null;
	 placeHolder = null;
 	 addEventListeners = null;
 	 checkValues = null;


 	 switch(platform){
 	 	case 3:
 	 		 touchSound = null;
			 nativecontrols = null;
			 removeSound = null;
			  $.form.close({
				activityEnterAnimation : Ti.App.Android.R.anim.slide_in_right,
		        activityExitAnimation : Ti.Android.R.anim.slide_out_left
			 });
 	 	break;
 	 	default:
 	 		 $.form.close({transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
 	 	break;
 	 }


	 closeWindow = null;
	 $.form = null;
}




