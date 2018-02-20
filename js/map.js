function initMap() {

        var origin = {lat: 41.85, lng: -87.65};
        var destination = {lat: 39.79, lng: -86.14};

        var mapOptions = {
              center: origin,
              zoom: 8
            }

        // Create a map object and specify the DOM element for display.
        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        plotDir(origin, destination); // calling the direction plot

        function plotDir(origin, destination){

              var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
              });

              // Set destination, origin and travel mode.
              var request = {
                destination: destination,
                origin: origin,
                travelMode: 'DRIVING'
              };

               // Pass the directions request to the directions service.
              var directionsService = new google.maps.DirectionsService();
              directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                  // Display the route on the map.
                  directionsDisplay.setDirections(response);
                }
              });
        }


        // Add a style-selector control to the map.
        var styleControl = document.getElementById('style-selector-control');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);

        // Set the map's style to the initial value of the selector.
        var styleSelector = document.getElementById('style-selector');
        map.setOptions({styles: styles[styleSelector.value]});

        // Apply new JSON when the user selects a different style.
        styleSelector.addEventListener('change', function() {
          map.setOptions({styles: styles[styleSelector.value]});
        });

        $('#satelite_toggle').change(function(){
          if($(this).is(':checked')) {
              map.setMapTypeId('satelite');
          } else {
              map.setMapTypeId('roadmap');
          }
      });

        $('#map_toggle').change(function(){
            if($(this).is(':checked')) {
                map.setMapTypeId('terrain');
            } else {
                map.setMapTypeId('roadmap');
            }
        });

        

        $('#plot').on('click', function(){
            var origin_text = $('#origin').val();
            var destination_text = $('#destination').val();

            $.ajax(
              {
                url: "http://maps.google.com/maps/api/geocode/json?address=" + origin_text,
              })
              .done(function( data ) {
                  origin = data.results[0].geometry.location
                  plotDir(origin, destination);
                  console.log( "origin", origin );
                 
               });

                $.ajax(
                {
                  url: "http://maps.google.com/maps/api/geocode/json?address=" + destination_text,
                })
                .done(function( data ) {
                  if ( console && console.log ) {
                    destination = data.results[0].geometry.location;
                    plotDir(origin, destination);
                    console.log( "destination", destination );
                    }
                 });
        })


        
      }

