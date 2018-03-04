const distanceDiv = document.getElementById('distance');
const durationDiv = document.getElementById('duration');

const price_comfortplus = document.getElementById('price_comfortplus');
const price_comfort = document.getElementById('price_comfort');
const price_basic = document.getElementById('price_basic');
const price_bodaboda = document.getElementById('price_bodaboda');
const price_goods = document.getElementById('price_goods');
const price_ladybug = document.getElementById('price_ladybug');

const cars_card = document.getElementById('cars');


const request_btn = document.getElementById('request-btn');

const tripOption = {
    indv: {
        b: {rate: 29, min: 200},
        c: {rate: 40, min: 200},
        cp: {rate: 50, min: 270},
        boda: {rate: 20, min: 50},
        ladybug: {rate: 40, min: 200},
        goods: {rate: 60, min: 300},
        base: 100
    },
    corp: {
        b: {rate: 40, min: 270},
        c: {rate: 45, min: 270},
        cp: {rate: 55, min: 270},
        boda: {rate: 20, min: 270},
        ladybug: {rate: 45, min: 270},
        goods: {rate: 60, min: 300},
        base: 100
    }
};

const Trip = {
    time: 0,
    distance: 0,
    tripOption: null,
    fare: function () {
        return {
            basic: this.calculate(this.tripOption.b),
            comfort: this.calculate(this.tripOption.c),
            comfortplus: this.calculate(this.tripOption.cp),
            boda: this.calculate(this.tripOption.boda),
            ladybug: this.calculate(this.tripOption.ladybug),
            goods: this.calculate(this.tripOption.goods)
        }
    },
    calculate: function (rate) {
        var fare = Math.ceil(rate.rate * this.distance + (4 * this.time) + this.tripOption.base);
        return (fare < rate.min) ? rate.min : fare;
    }
};

const calculateFare = function () {
    const isCorp = $('#coporate_toggle');
    Trip.distance = mapService.meta.distance.value / 1000;
    Trip.time = mapService.meta.duration.value / 60;
    Trip.tripOption = tripOption.indv;
    if (isCorp.is(':checked')) {
        Trip.tripOption = tripOption.corp;
    }
    price_comfortplus.innerText = Trip.fare().comfortplus;
    price_comfort.innerText = Trip.fare().comfort;
    price_basic.innerText = Trip.fare().basic;
    price_bodaboda.innerText = Trip.fare().boda;
    price_ladybug.innerText =  Trip.fare().ladybug;
    price_goods.innerText = Trip.fare().goods;
};

function DirectionService(map) {

        this.meta = {};
        this.map = map;
        this.originPlaceId = null;
        this.destinationPlaceId = null;
        this.travelMode = 'DRIVING';
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');
    this.directionsService = new google.maps.DirectionsService;

    const dirOptions = {
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

    let originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {placeIdOnly: true});
    let destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {placeIdOnly: true});


    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

      }


      DirectionService.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
          let me = this;
          autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', function() {
            let place = autocomplete.getPlace();
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
          let me = this;
          this.directionsService.route({
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          provideRouteAlternatives: false,
          travelMode: this.travelMode
        }, function(response, status) {
          if (status === 'OK') {

            me.directionsDisplay.setDirections(response);
            
            me.meta =  response.routes[0].legs[0];

            distanceDiv.innerText = me.meta.distance.text;
            durationDiv.innerText = me.meta.duration.text;

            calculateFare();

              let hasClass = cars_card.classList.contains('fadeInUp');

              if(!hasClass){
                   cars_card.classList.add('fadeInUpBig');
                   request_btn.style.display = "block";
                    request_btn.classList.add('fadeIn');
              }

            //   if(!request_btn.classList.contains('fadeInUp')){
            //       request_btn.style.display = "block";
            //         request_btn.classList.add('fadeIn');
            //   }
              

          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

      };




      


      
      