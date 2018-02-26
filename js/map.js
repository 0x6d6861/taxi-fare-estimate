let map = null;
let mapOptions = {
  center: {lat: -1.3028618, lng: 36.7073085},
  zoom: 13,
  disableDefaultUI: true
};

let mapService;


function initMap() {
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        mapService = new DirectionService(map);
}


$(document).ready(() => {


    $('#trip').addClass('fadeIn');

    const styleSelector = $('#style-selector');


    map.setOptions({styles: styles[styleSelector.val()]});

    map.setMapTypeId('terrain');

    styleSelector.on('change', () => {
      map.setOptions({styles: styles[styleSelector.val()]});
    });

    $('#map_toggle').change(() => {
        if($(this).is(':checked')) {
            map.setMapTypeId('terrain');
        } else {
            map.setMapTypeId('roadmap');
        }
    });

    $('#coporate_toggle, #vtype-selector').change(() => {
        calculateFare();
    });



    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          mapOptions.center.lat = position.coords.latitude;
          mapOptions.center.lng = position.coords.longitude;
          mapOptions.zoom = 13;
          map.setOptions(mapOptions);

            const geocoder = new google.maps.Geocoder;

            geocoder.geocode({'location': mapOptions.center}, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        map.setZoom(15);
                        mapService.originPlaceId = results[0].place_id;
                        $('#origin').val(results[0].formatted_address);
                        mapService.route();
                    } else {
                        window.alert('Your Locaction could not be determined');
                    }
                }
            });

        });

    }

  });

