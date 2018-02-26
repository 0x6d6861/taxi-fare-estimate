var map;
var mapOptions = {
  center: {lat: -1.3028618, lng: 36.7073085},
  zoom: 10,
  disableDefaultUI: true
};


var mapService;

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        mapService = new DirectionService(map);
}

$(document).ready(function(){

    $('#trip').addClass('fadeIn');

    var styleSelector = $('#style-selector');
    console.log(map);

    map.setOptions({styles: styles[styleSelector.val()]});

    map.setMapTypeId('terrain');

    styleSelector.addEventListener('change', function() {
      map.setOptions({styles: styles[styleSelector.val()]});
    });  

    $('#map_toggle').change(function(){
        if($(this).is(':checked')) {
            map.setMapTypeId('terrain');
        } else {
            map.setMapTypeId('roadmap');
        }
    });

    $('#coporate_toggle, #vtype-selector').change(function(){
        calculateFare();
    });



    

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          mapOptions.center.lat = position.coords.latitude;
          mapOptions.center.lng = position.coords.longitude;
          mapOptions.zoom = 14;          
          map.setOptions(mapOptions);

            var geocoder = new google.maps.Geocoder;
            var infowindow = new google.maps.InfoWindow;

            geocoder.geocode({'location': mapOptions.center}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        map.setZoom(11);
                        mapService.originPlaceId = results[0].place_id;
                        $('#origin').val(results[0].formatted_address);
                        mapService.route();
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });

        });

    }

  });
  
  