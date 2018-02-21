var distanceDiv = document.getElementById('distance');
var durationDiv = document.getElementById('duration');
var fareDiv = document.getElementById('fare');

var tripOption = {
  indv: {
    b: 29,
    c: 30,
    cp: 35
  },
  corp: {
    b: 40,
    c: 45,
    cp: 55
  }
}

var Trip = {
  rate: 0,
  time: 0,
  distance: 0,
  fareTime: function(){
    var estimate = this.rate * this.distance + (4 * this.time) + 100;
    return Math.ceil(estimate);
  }
}
     
var calculateFare = function (){
    var isCorp = $('#coporate_toggle');
    var type = $('#vtype-selector').val();
    Trip.rate = tripOption.indv[type];
    Trip.distance = mapService.meta.distance.value / 1000;
    Trip.time = mapService.meta.duration.value / 60;
    if(isCorp.is(':checked')){
      Trip.rate = tripOption.corp[type];
      // console.log(Trip.rate);
    }
    return Trip;
  }


var makeMarker = function( position, icon, title ) {
 new google.maps.Marker({
  position: position,
  map: map,
  icon: icon,
  title: title
 });
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
        this.directionsDisplay = new google.maps.DirectionsRenderer;
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
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {
            me.directionsDisplay.setDirections(response);

            
            me.meta =  response.routes[0].legs[0];
            // console.log(new_meta);
            distanceDiv.innerText = me.meta.distance.text;
            durationDiv.innerText = me.meta.duration.text;
            fareDiv.innerText = calculateFare().fareTime();
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
              
                    // 

      };




      


      
