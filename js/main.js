
        var foursquareApi = {
            clientId: "KYXSQGDXTGZ4R0MKHKUJEVILXV4IDZGZN0EF5ZVZANTNAGLB",
            clientSecret: "4AGCLBK4N425Y3UY4QQA5SYTP555SBK5TBB3K33A4ABH2WJ4",
            oauth_token:"5BEUWLP13HU3XWQD5VSFPOINAMGK2R5FQS4HMX0OXWHE5H0U",
            code: "HQEV3FJDFEZXOUHWSATSNUNH1ZF5NNUFAHBCY0Y3ZPJ0RRNM",
            redirectUrl : "http://localhost/foursquare/",
            authorize: function(){
                var url = "https://foursquare.com/oauth2/access_token";
                    url += "?client_id="+this.clientId;
                    url += "&client_secret="+this.clientSecret;
                    url += "&grant_type=authorization_code";
                    url += "&redirect_uri="+this.redirectUrl;
                    url += "&code="+this.code;

                    this.getJson(url, function(data){
                        console.log("authorize",data);
                    })
            },
            getCode : function(){
                var url = "https://foursquare.com/oauth2/authenticate";
                    url += "?client_id="+this.clientId;
                    url += "&response_type=code";
                    url += "&redirect_uri="+this.redirectUrl;
                    this.getJson(url, function(data){
                        console.log("code",data);
                    })

            },
            getJson: function(url, callback){
                $.getJSON(url, function(data) {
                  callback(data);
                });
            },
            getPhotos: function(venueAlbums){
                var heightDimension = 400;
                var widthDimension = 400;

                var dimensions = heightDimension+'x'+widthDimension;

                var album = "";
                //loop over groups
                $.each(venueAlbums, function(index, value) {
                    //loop over items
                    $.each(value.items, function(index, v) {
                         album += '<style> .foto{background-image: url("'+v.prefix+dimensions+v.suffix+'");}</style>';
                    });
                });
                $('#venue #photos').html(album);
            },
            bindTrendEvent: function(){
                var that = this;
                $("a.trendlist").on("click", function(event){
                    event.preventDefault();
                    var venueId = $(this).data("venueid");
                    that.exploreVenue(venueId);
                });
            },
            bindSearchEvent: function(){
                var that = this;
                $("a.searchlist").on("click", function(event){
                    event.preventDefault();
                    var venueId = $(this).data("venueid");
                    that.exploreVenue(venueId);
                });
            },
            bindVenueEvent: function(){
                var that = this;
                $("#venue button").on("click", function(event){
                    event.preventDefault();
                    var venueId = $("#venue").data("venueId");
                    that.markToDo(venueId);
                });
            },
            getLatestVersion: function(){
                var d = new Date();
                var year = d.getFullYear();
                var month = d.getMonth();
                var day = d.getMonth();

                if(month <10){
                    month = "0"+month;
                }
                if(day <10){
                    day = "0"+day;
                }
                return year+month+day;
            },
            search: function(){
                //var location = "40.7,-74"; //chicago
                var location = "19.444053,-99.182342"; //london, shaftesbury avenue
                //var location = "29.43601,106.503525"; //china
                //var location = "51.165691,10.451526"; //germany

                this.viewTrends(location);

                //this.exploreVenueCategories();
                //this.exploreCategories();

                //var query = "burger king";
                //var query = "mcdonalds";
                var limit = 50;

                var latestversion = this.getLatestVersion();

                var that = this;

                var url = "https://api.foursquare.com/v2/venues/search?ll="+location+"&query="+query+"&limit="+limit+"&oauth_token="+this.oauth_token+"&v="+latestversion;
                console.log("url", url);
                this.getJson(url, function(data){
                    console.log("getting data ", data);
                    var setOfVenues = data.response.venues;
                    var template = '<ul id="searchResults"></ul>';
                    $('body').append(template);

                    $.each(setOfVenues, function(index, value) {
                        console.log(value);
                        var innterListItem = '<li><a class="searchlist" data-venueid="'+value.id+'" href="#">'+value.name+' - '+value.id+'</a></i>';
                        $('#searchResults').append(innterListItem);
                    });
                    that.bindSearchEvent();
                });
            },
            viewTrends: function(location){

                var that = this;

                //var location = "44.3,37.2";
                var limit = 50;
                var radius = 2000 ;

                //&limit="+limit+"&radius="+radius+"
                var latestversion = this.getLatestVersion();

                var url = "https://api.foursquare.com/v2/venues/trending?ll="+location+"&oauth_token="+this.oauth_token+"&v="+latestversion;
                this.getJson(url, function(data){
                    console.log("getting trends", data);

                    var setOfVenues = data.response.venues;
                    var template = '<ul id="trendResults"></ul>';
                    $('body').append(template);

                    $.each(setOfVenues, function(index, value) {
                        console.log(value);
                        if(index==3)
                            return false;
                        var innterListItem = '<li><a class="trendlist" data-venueid="'+value.id+'" href="#">'+value.name+' </a></i>';
                        $('#trendResults').append(innterListItem);
                    });
                    that.bindTrendEvent();
                });

            },
            viewEvents: function(venueId){
                var latestversion = this.getLatestVersion();
                var url = "https://api.foursquare.com/v2/venues/"+venueId+"/events?oauth_token="+this.oauth_token+"&v="+latestversion;
                this.getJson(url, function(data){
                    console.log("getting events", data);

                    var setOfEvents = data.response.events.items;
                    //var template = '<ul id="eventResults"></ul>';
                    //$('body').append(template);

                    $('#events').empty();
                    $.each(setOfEvents, function(index, value) {
                        console.log(value);
                        var innterListItem = '<li>'+value.name+' - allday : '+value.allDay+'</i>';
                        $('#events').append(innterListItem);
                    });
                    //that.bindTrendEvent();
                });

            },
            exploreVenueCategories: function(){
                var latestversion = this.getLatestVersion();
                var url = "https://api.foursquare.com/v2/venues/categories?oauth_token="+this.oauth_token+"&v="+latestversion;
                this.getJson(url, function(data){
                    console.log("getting venues categories", data);

                    var setOfVenueCategories = data.response.categories;
                    //var template = '<ul id="eventResults"></ul>';
                    //$('body').append(template);

                    $.each(setOfVenueCategories, function(index, value) {
                        console.log(value.name);

                        //loop over items
                        $.each(value.categories, function(index, v) {
                            console.log("-"+v.name);
                        });
                        //var innterListItem = '<li><a class="trendlist" data-venueid="'+value.id+'" href="#">'+value.name+' - '+value.id+'</a></i>';
                        //$('#eventResults').append(innterListItem);
                    });
                    //that.bindTrendEvent();
                });
            },
            exploreCategories: function(){
                var latestversion = this.getLatestVersion();
                var url = "https://api.foursquare.com/v2/events/categories?oauth_token="+this.oauth_token+"&v="+latestversion;
                this.getJson(url, function(data){
                    console.log("getting categories", data);

                    var setOfCategories = data.response.categories;
                    //var template = '<ul id="eventResults"></ul>';
                    //$('body').append(template);

                    $.each(setOfCategories, function(index, value) {
                        console.log(value.name);

                        //loop over items
                        $.each(value.categories, function(index, v) {
                            console.log("-"+v.name);
                        });
                        //var innterListItem = '<li><a class="trendlist" data-venueid="'+value.id+'" href="#">'+value.name+' - '+value.id+'</a></i>';
                        //$('#eventResults').append(innterListItem);
                    });
                    //that.bindTrendEvent();
                });
            },
            exploreVenue: function(venueId){
                var latestversion = this.getLatestVersion();
                var url = "https://api.foursquare.com/v2/venues/"+venueId+"?oauth_token="+this.oauth_token+"&v="+latestversion;

                var that = this;
                this.getJson(url, function(data){

                    var venue = data.response.venue;
                    console.log("venue",venue);

                    $('#venue #name').html(venue.name);
                    $('#venue #id').html(venue.id);
                    $('#venue #location').html(venue.location.address+"<br>"+venue.location.city+"<br>"+venue.location.country+"<br>"+venue.location.postalCode);
                    $('#venue #rating').html(venue.rating);
                    $('#venue').data("venueId", venue.id);

                    that.viewEvents(venue.id);
                    that.getTips(venue.tips.groups);
                    that.getSpecials(venue.specials);
                    that.getHours(venue.id);

                    var foursquareObj = {
                                            id: venue.id,
                                            name: venue.name,
                                            streetAddress: venue.location.address,
                                            locality: venue.location.city,
                                            region: venue.location.state,
                                            postalCode: venue.location.postalCode,
                                        };

                    var venuePhotoCount = venue.photos.count;
                    var venueAlbums = venue.photos.groups;

                    that.getPhotos(venueAlbums);
                    that.bindVenueEvent();
                    that.myFoursquareReplaceSave(foursquareObj);
                });
            },
            getTips: function(tips){
                    $('#tips').empty();
                    //loop over groups
                    $.each(tips, function(index, value) {
                        //loop over items
                        $.each(value.items, function(index, v) {
                            console.log("the tip ", v.text);
                            $('#tips').append('<li>'+v.text+'</li>');
                        });
                    });
            },
            getSpecials: function(specials){
                    $('#specials').empty();
                    //loop over groups
                    console.log("specials", specials);
            },
            getHours: function(venueId){
                $('#times').hide();
                var daysofweek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

                var latestversion = this.getLatestVersion();
                var url = "https://api.foursquare.com/v2/venues/"+venueId+"/hours?oauth_token="+this.oauth_token+"&v="+latestversion;
                console.log("getHours");
                this.getJson(url, function(data){
                    console.log("data.response", data.response);
                    if(data.response.hours.timeframes != undefined){
                        $('#times').show();
                        $('#times').empty();
                        var timeframes = data.response.hours.timeframes;
                        $.each(timeframes, function(index, value) {
                            //loop over days
                            var startTime = value.open[0].start;
                            var endTime = value.open[0].end;

                            $.each(value.days, function(index, v) {
                                $('#times').append('<li>'+daysofweek[v-1]+'  : '+startTime+'-'+endTime+'</li>');
                            });
                        });
                    }
                });
            },
            markToDo: function(venueId){
                console.log("mark venue id", venueId);
                //https://api.foursquare.com/v2/venues/4d825176bede5481abdd0fd1/marktodo
            },
            myFoursquareReplaceSave: function(foursquareObj) {

                var vcartTitle = "hcard-"+foursquareObj.id;
                var vcard = '<div id="'+vcartTitle+'" class="vcard"><span class="fn"><span class="given-name">'+foursquareObj.name+'</span></span><div class="adr"><div class="street-address">'+foursquareObj.streetAddress+'</div><span class="locality">'+foursquareObj.locality+'</span><span class="region">'+foursquareObj.region+'</span><span class="postal-code">'+foursquareObj.postCode+'</span></div></div>';
               

                $('#foursquare').empty().html(vcard+fourSquareButton);
                this.startWidget();
            },
            init: function(){
                this.search();
            },
            startWidget: function(){
                window.___fourSq = {};
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'http://platform.foursquare.com/js/widgets.js';
                s.async = true;
                var ph = document.getElementsByTagName('script')[0];
                ph.parentNode.insertBefore(s, ph);
            }
        };º