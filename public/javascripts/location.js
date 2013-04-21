var geocoder, results_found = false;
var coordinates= [0,0];
var locationName;

function codeAddress(address, map_canvas) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });

      coordinates[1] = results[0].geometry.location.jb;
      coordinates[0] = results[0].geometry.location.kb;
      locationName=results[0].formatted_address;
      console.log(results[0].formatted_address);
      console.log(coordinates);

      $("#long").val(results[0].geometry.location.Za);
      $("#lat").val(results[0].geometry.location.$a);
    } else {
      console.log('Geocode was not successful for the following reason: ' + status + ' blah: ' + address);
    }
  });
}


$(function(){

  fakedata();

  map_canvas = $(".map_canvas");
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(43.647566,-79.384847);
  var mapOptions = {
    disableDefaultUI: true,
    zoom: 12,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(map_canvas[0], mapOptions);

  $("#location").keydown(function(e){
    if (e.which == 13) {
      e.preventDefault();
      codeAddress($(this).val(), map_canvas);
    }
  });
});