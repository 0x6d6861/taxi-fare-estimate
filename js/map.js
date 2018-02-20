var map;
var mapOptions = {
  center: {lat: 41.85, lng: -87.65},
  zoom: 8
}

var mapService;

function initMap() {


        // Create a map object and specify the DOM element for display.
        map = new google.maps.Map(document.getElementById('map'), mapOptions); 

        mapService = new DirectionService(map);             

      }
     
  $(document).ready(function(){

      

      console.log(mapService.computeTotalDistance());


    // Set the map's style to the initial value of the selector.
    var styleSelector = $('#style-selector')[0];

    map.setOptions({styles: styles[styleSelector.value]});

    // Apply new JSON when the user selects a different style.
    styleSelector.addEventListener('change', function() {
      map.setOptions({styles: styles[styleSelector.value]});
    });  

  //   $('#satelite_toggle').change(function(){
  //     if($(this).is(':checked')) {
  //         map.setMapTypeId('hybrid');
  //     } else {
  //         map.setMapTypeId('roadmap');
  //     }
  // });

    $('#map_toggle').change(function(){
        if($(this).is(':checked')) {
            map.setMapTypeId('terrain');
        } else {
            map.setMapTypeId('roadmap');
        }
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          mapOptions.center.lat = position.coords.latitude;
          mapOptions.center.lng = position.coords.longitude;
          mapOptions.zoom = 10;          
          map.setOptions(mapOptions);
        });

    }

    
  })  
      