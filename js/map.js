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



//  Phone Number option
  var telInput = $("#phone"),
      errorMsg = $("#error-msg");

      // initialise plugin
telInput.intlTelInput({
  hiddenInput: "full_phone",
  initialCountry: "auto",
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "";
      callback(countryCode);
    });
  },
  onlyCountries: ["ke", "ng", "rw", "gh", "cm", ],
  utilsScript: "../js/assets/build/js/utils.js"
});

var reset = function() {
  telInput.removeClass("is-invalid");
  errorMsg.removeClass("invalid-feedback show");
  errorMsg.addClass("invalid-feedback hide");  
};

// on blur: validate
telInput.blur(function() {
  reset();
  if ($.trim(telInput.val())) {
    if (telInput.intlTelInput("isValidNumber")) {
      telInput.addClass("is-valid");
    } else {
      telInput.addClass("is-invalid");
      errorMsg.removeClass("invalid-feedback hide");
      errorMsg.addClass("invalid-feedback show");
    }
  }
});

telInput.on("keyup change", reset);

//  END Phone Number option




// Map Style Option
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

// END Map style Option


// If location has been allowed
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

  // END Location allowed

  $('#request-btn').on('click', function(){
    var btn_text = $.trim($(this).text());
    console.log(btn_text);
    if(btn_text == 'CANCEL REQUEST'){
      $(this).html('<span>REQUEST A LITTLE</span> <i class="fa fa-arrow-right pull-right"></i>');
      $('#request-little').removeClass('fadeIn').css('display', 'none');
    }else{
      $(this).html('<span>CANCEL REQUEST</span> <i class="fa fa-times pull-right"></i>');
      $('#request-little').css('display', 'block').addClass('fadeIn');
    }
    
  })

  $('#booking-form').on('submit', function(e){
      e.preventDefault();
      $('#confirm_trip').html('<i class="fa fa-spinner fa-pulse"></i>');      
      alert("Hello");
  })

  });

