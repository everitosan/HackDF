var pila=[];
var map;
var tst=0;
$(document).ready(function(){

		$('.back').fadeOut(3000);
	
			$('body').on('keydown',es_H);
			$('.portada').on('click',cerrar);
			$('.bar').on('click',clickbar);
			$('#back').on('touchend',backbar);

	cargamapa();
	setTimeout(
		function(){
		  cargapila();
		  aire();
			$('.t').on('click',dasclick);
		}
		,5000);
	
});

function es_H(event)
{
	if(event.keyCode==72)
	{
		alerta('Espectáculos','Aquí es el Laboratorio para la ciudad, dónde se está llevando a cabo el primer Hack para la ciudad, puedes ingresar con una identificación oficial, hoy es la gran final. ¡Anímate!.');
	}
}

function backbar()
{
	$("#wrap").css("right","-581px");
}

function dasclick(event){
	$("#wrap").css("right","0");
};

function clickbar(){
	$("#wrap").css("right","-350px");
}
function cerrar(){
	(document.body.offsetWidth<500)?$("#wrap").css("right","-581px"):$("#wrap").css("right","-350px");
};

function cargapila()
{
	$('#trendResults').append('<div onclick="ajaxtweet()" class="cont_list tweet"><div class="titulo_l" ><div class="icono icon-alerta_icn"></div><span class="t"><a class="trendlist" href="#">#Tráfico </a></span></div></div> <div class="line"><img src="img/line.png"></div>');

	var ac=.003;
	$(museos).each(function(){
		var reslat=this.lat - lat;
		reslat=Math.abs(reslat);
		//console.log(this.lat+' - '+lat+'='+ reslat );		
		if(reslat<ac)
			{
				pila.push(this);
				var innterListItem = '<div data-index="'+(pila.length-1)+'" class="cont_list bd"><div class="titulo_l" ><div class="icono icon-expo_icn"></div><span class="t"><a class="trendlist" href="#">'+this.nombre+' </a></span></div></div> <div class="line"><img src="img/line.png"></div>';
                $('#trendResults').append(innterListItem);
			}
	});

	$(teatros).each(function(j){
		var reslat=this.lat - lat;
		reslat=Math.abs(reslat);
		//console.log(this.lat+' - '+lat+'='+ reslat );		
		if(reslat<ac)
		{
			pila.push(this);
			var innterListItem = '<div data-index="'+(pila.length-1)+'" class="cont_list bd"><div class="titulo_l" ><div class="icono icon-otro_icn"></div><span class="t"><a class="trendlist" href="#">'+this.nombre+' </a></span></div></div> <div class="line"><img src="img/line.png"></div>';
            $('#trendResults').append(innterListItem);
		}
	});
	

	//Markers de pila
	   for(var i in pila){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pila[i].lat,pila[i].lon)
            , map: map
            , title: pila[i].nombre
            , icon: "img/loc_icn_h.png"	
            , draggable: false
        });
    }

    //Marker, posición actual
    new google.maps.Marker({
        position: new google.maps.LatLng(lat,lon)
        , map: map
        , title: 'Posición actual'
        , cursor: 'default'
        , draggable: false
    });

    //listener de elementos de la pila que pasan a detalle
    $('.bd').on('click',fdetalle);
    $('.cont_list').on('click',fdetalle2);

}

function fdetalle()
{
	$('#venue #name').html( $(this).text() );
	$('#venue #tips').html('');
	$('#venue #location').html(pila[$(this).attr('data-index')].info);
	$('.foto').css('background','url("img/generic.jpg")');
}

function fdetalle2()
{
	if( $(this).attr('class').indexOf('bd')==-1 && $(this).attr('class').indexOf('tweet')==-1 )
	{
		$('.foto').attr('style','');
	}
}

function cargamapa()
{
	navigator.geolocation.getCurrentPosition(done,notdone);
}
function done(geo)
{
	
	
    lon=geo.coords.longitude;
    lat=geo.coords.latitude;

   	var mapOptions = {
    	zoom: 14,
	    center: new google.maps.LatLng(lat, lon)
  	};

  map = new google.maps.Map(document.getElementById('portada'),mapOptions);


}

function notdone()
{
    console.log('error');   
}