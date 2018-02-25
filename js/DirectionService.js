var distanceDiv = document.getElementById('distance');
var durationDiv = document.getElementById('duration');
// var fareDiv = document.getElementById('fare');

var price_comfortplus = document.getElementById('price_comfortplus');
var price_comfort = document.getElementById('price_comfort');
var price_basic = document.getElementById('price_basic');

var cars_card = document.getElementById('cars');


var tripOption = {
  indv: {
    b: 29,
    c: 30,
    cp: 35,
    base: 100
  },
  corp: {
    b: 40,
    c: 45,
    cp: 55,
    base: 120
  }
}

var Trip = {
  time: 0,
  distance: 0,
  tripOption,
  fare: function(){
    return {
      basic: Math.ceil(this.tripOption.b * this.distance + (4 * this.time) + this.tripOption.base),
      comfort : Math.ceil(this.tripOption.c * this.distance + (4 * this.time) + this.tripOption.base),
      comfortplus: Math.ceil(this.tripOption.cp * this.distance + (4 * this.time) + this.tripOption.base)
    }
  }
}
     
var calculateFare = function (){
    var isCorp = $('#coporate_toggle');
    Trip.distance = mapService.meta.distance.value / 1000;
    Trip.time = mapService.meta.duration.value / 60;
    Trip.tripOption = tripOption.indv;
    if(isCorp.is(':checked')){
      Trip.tripOption = tripOption.corp;
      // console.log(Trip.rate);
    }
    price_comfortplus.innerText = Trip.fare().comfortplus;
    price_comfort.innerText = Trip.fare().comfort;
    price_basic.innerText = Trip.fare().basic;
    // return Trip;
    // console.log(Trip);
  }

function DirectionService(map) {



        this.meta = {};
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
        var originInput = document.getElementById('origin');
        var destinationInput = document.getElementById('destination');
        //var modeSelector = document.getElementById('mode-selector');
        this.directionsService = new google.maps.DirectionsService;

        var contentString = "Hello";
            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });


        var dirOptions = {
          polylineOptions: {
            strokeColor: '#17c671',
            strokeWeight: 5,
          },
          markerOptions: {
            draggable: true
          },
          suppressMarkers: false
        };

        this.directionsDisplay = new google.maps.DirectionsRenderer(dirOptions);

        
        this.directionsDisplay.setMap(map);

        

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});

   

        //this.setupClickListener('changemode-walking', 'WALKING');
        //this.setupClickListener('changemode-transit', 'TRANSIT');
        //this.setupClickListener('changemode-driving', 'DRIVING');

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
        

        //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        //this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
      }

      // Sets a listener on a radio button to change the filter type on Places
      // Autocomplete.
      // DirectionService.prototype.setupClickListener = function(id, mode) {
      //   var radioButton = document.getElementById(id);
      //   var me = this;
      //   radioButton.addEventListener('click', function() {
      //     me.travelMode = mode;
      //     me.route();
      //   });
      // };

      DirectionService.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
        var me = this;
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
          var place = autocomplete.getPlace();
          if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
          }
          if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
          } else {
            me.destinationPlaceId = place.place_id;
          }
          me.route();
        });

      };

      DirectionService.prototype.route = function() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
          return;
        }
        var me = this;
        this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          provideRouteAlternatives: true,
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {

            //map.fitBounds(bounds);
            
          

            me.directionsDisplay.setDirections(response);
            
            me.meta =  response.routes[0].legs[0];
            console.log(response);
            distanceDiv.innerText = me.meta.distance.text;
            durationDiv.innerText = me.meta.duration.text;


            calculateFare()

            var hasClass = cars_card.classList.contains('fadeInUp');
              
              if(!hasClass){
                  // cars_card.classList.add('display_block');
                   cars_card.classList.add('fadeInUpBig');
              }
            
              // console.log(response.routes);



          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
              
        
                    // 

      };




      


      
      