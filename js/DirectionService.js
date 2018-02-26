var distanceDiv = document.getElementById('distance');
var durationDiv = document.getElementById('duration');

var price_comfortplus = document.getElementById('price_comfortplus');
var price_comfort = document.getElementById('price_comfort');
var price_basic = document.getElementById('price_basic');

var cars_card = document.getElementById('cars');

var tripOption = {
  indv: {
    b: {rate : 29, min: 200 },
    c: {rate : 40, min: 200 },
    cp: {rate : 50, min: 270 },
    base: 100
  },
  corp: {
      b: {rate : 40, min: 270 },
      c: {rate : 45, min: 270 },
      cp: {rate : 55, min: 270 },
    base: 100
  }
};

var Trip = {
  time: 0,
  distance: 0,
  tripOption: null,
  fare: function(){
    return {
      basic: this.calculate(this.tripOption.b),
      comfort : this.calculate(this.tripOption.c),
      comfortplus: this.calculate(this.tripOption.cp)
    }
  },
    calculate: function (rate) {
      var fare = Math.ceil(rate.rate * this.distance + (4 * this.time) + this.tripOption.base);
        return (fare < rate.min) ? rate.min : fare;
    }
};
     
var calculateFare = function (){
    var isCorp = $('#coporate_toggle');
    Trip.distance = mapService.meta.distance.value / 1000;
    Trip.time = mapService.meta.duration.value / 60;
    Trip.tripOption = tripOption.indv;
    if(isCorp.is(':checked')){
      Trip.tripOption = tripOption.corp;
    }
    price_comfortplus.innerText = Trip.fare().comfortplus;
    price_comfort.innerText = Trip.fare().comfort;
    price_basic.innerText = Trip.fare().basic;
  };

function DirectionService(map) {

        this.meta = {};
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
        var originInput = document.getElementById('origin');
        var destinationInput = document.getElementById('destination');
        this.directionsService = new google.maps.DirectionsService;

        var dirOptions = {
          polylineOptions: {
            strokeColor: '#ffb400',
            strokeWeight: 5
          },
          markerOptions: {
            draggable: false
          },
          suppressMarkers: false
        };

        this.directionsDisplay = new google.maps.DirectionsRenderer(dirOptions);

        
        this.directionsDisplay.setMap(map);

        var originAutocomplete = new google.maps.places.Autocomplete(
            originInput, {placeIdOnly: true});
        var destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput, {placeIdOnly: true});


        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

      }


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
          console.log(me);
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
          provideRouteAlternatives: false,
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {

            me.directionsDisplay.setDirections(response);
            
            me.meta =  response.routes[0].legs[0];
            console.log(response);
            distanceDiv.innerText = me.meta.distance.text;
            durationDiv.innerText = me.meta.duration.text;

            calculateFare();

            var hasClass = cars_card.classList.contains('fadeInUp');
              
              if(!hasClass){
                   cars_card.classList.add('fadeInUpBig');
              }

          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

      };




      


      
      