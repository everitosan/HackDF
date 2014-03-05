function aire()
{
    var url_peticion="http://datos.labplc.mx/aire/";
    var op=["calidad","clima","uv"];

    $(op).each(function(i){
        var url_peticiona=url_peticion+this+".json?";

            $.ajax({
                        type:'GET',
                        url:url_peticiona,
                        crossDomain:true,
                        dataType:"JSONP",
                        cache: true,
                        json:callbackName,
                        //jsonp: false, 
                       // jsonpCallback: callbackName,
                        statusCode: {
                                    404: function() {
                                     console.log('no puedo');
                                    }
                                  },
                        success: function(res){
                         //console.log(res.consulta);
                             switch(i)
                                {
                                    case 0:
                                        (res.consulta.calidad.categoria.indexOf('mala')!= -1)?alerta('Calidad del aire',"¡Ups!, se nos pasó la mano, superamos los límites de contaminación, procura no salir. <br> "+res.consulta.calidad.recomendaciones):console.log('calidad normal');
                                        break;
                                    case 1:
                                        (res.consulta.clima.condicion.indexOf('lluvia')!=-1)?cambiaclima(): console.log(' clima normal');
                                        break;
                                    default:
                                        (res.consulta.uv.indice>5)? alerta('Radiación UV',"Utiliza bloqueador, el sol está muy potente. <br>"+res.consulta.uv.recomendaciones):console.log('uv normal');
                                        break;
                                }
                        }
                });

        
    });
}


function callbackName(json)
{
    alert('entra a callbackName '+this);
   
}

function alerta(tipo,tip)
{
    $('body').append("<div id='alert' >  <h2>" +tipo+".</h2> <p>"+tip+"</p>  <div id='closealerta'  onclick='quitalert(this)' >OK</div> </div>");
    
}
function quitalert(el)
{
    $(el).parent().remove();
}