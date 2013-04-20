var geocoder, results_found = false;

function codeAddress(address, map_canvas) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
      });
      $("#long").val(results[0].geometry.location.Za);
      $("#lat").val(results[0].geometry.location.$a);
    } else {
      console.log('Geocode was not successful for the following reason: ' + status + ' blah: ' + address);
    }
  });
}

$(function(){
  console.log("vbkaslkfnas");
  map_canvas = $(".map_canvas");
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(43.4701302, -80.5357712);
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