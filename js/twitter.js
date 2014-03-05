var obtwitter=[];
var optwitter=["trafico","peligro","asalto", "violencia"];
var i=0;
var ajaxtweet=function(){
  
   
   $.ajax({
                type:'GET',
                url:"http://nearbytweets.com/get.json?q="+optwitter[i]+"&geocode="+lat+"%2C"+lon+"%2C10mi&include_entities=true&result_type=recent&count=10",
                crossDomain:true,
                dataType:"jsonp",
                cache: true,
                complete: tweetcomplete,
                json:callbacktwitterapi,
                //jsonp: false, 
               // jsonpCallback: callbackName,
                statusCode: {
                            404: function() {
                             console.log('no puedo');
                            }
                          },
                success: function(res){
                  obtwitter[i]=res;
                }
               });
};

function tweetcomplete()
{
  if(i<(optwitter.length-1))
  {
    i++;
    ajaxtweet();
  } 
  else
  {
    acomodatweetenpila();
  }
}

function acomodatweetenpila()
{
  $('.foto').css('background','url("img/generic.jpg")');
  $('#venue #tips').html('');
  $('#venue #location').html('');
  $('#venue #name').html('Twitter');
  
  $(obtwitter).each(function(){
    $(this.statuses).each(function(){
      //console.log(this.text );
      $('#venue #tips').append("<p>" + this.text+"</p>" );
    });
  });

    
}
    
        function callbacktwitterapi(json)
    {
        alert('entra a callbackName '+this);
       
    }
