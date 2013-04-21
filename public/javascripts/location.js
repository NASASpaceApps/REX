var geocoder, results_found = false;
var coordinates= [0,0];
var locationName;

//Take whatever we typed in and change the map
function codeAddress(address, map_canvas) {
  //Google maps geocoder stuff
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      //Take the coordinates and move them up a little bit to go above the search bar
      var latitlong = results[0].geometry.location;
      latitlong.jb = latitlong.jb -0.005;

      //Set the map to the point we generated
      map.setCenter(latitlong);

      //Messing with the marker so it doesnt cover the name of the place you're looking at
      latitlong.jb = latitlong.jb +0.005;
      latitlong.kb = latitlong.kb -0.015;


      //Place the marker
      var marker = new google.maps.Marker({
          map: map,
          position: latitlong
      });

      //skimming the coordinates because .location is messy.
      coordinates[1] = results[0].geometry.location.jb;
      coordinates[0] = results[0].geometry.location.kb;

      //Get the name of the place we're looking at.
      locationName=results[0].formatted_address;

      //Something to do with google maps
      $("#long").val(results[0].geometry.location.Za);
      $("#lat").val(results[0].geometry.location.$a);
    } else {
      console.log('Geocode was not successful for the following reason: ' + status + ' blah: ' + address);
    }
  });
}


$(function(){

  //fakedata();

  map_canvas = $(".map_canvas");
  geocoder = new google.maps.Geocoder();

  //Set the starting position to Toronto
  var latlng = new google.maps.LatLng(43.647566,-79.384847);
  var mapOptions = {
    //Get rid of zoom and other options
    disableDefaultUI: true,
    zoom: 12,
    //Set the center
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(map_canvas[0], mapOptions);


  //Getting the enter key. How is this not default behaviour? blah.
  $("#location").keydown(function(e){
    if (e.which == 13) {
      e.preventDefault();
      codeAddress($(this).val(), map_canvas);
    }
  });
});