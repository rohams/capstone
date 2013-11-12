//constructor 
function Node(lat,lng){
    this.lat=lat;
    this.lng=lng;
    
    this.getLat = function()
    {
        return this.lat;
    }
    
    this.getLng = function()
    {
        return this.lng;
    }
}

//calculate the weighted average of nodes
function getAverage(nodes){
    
    var cost= 2.5;
    var stepsize= 0.01;
    var threshold= 0.01;
    var xSum=0;
    var ySum=0;
    for (i=0;i<nodes.length;i++)
    {
        var xSum=xSum+nodes[i].getLat();
        var ySum=ySum+nodes[i].getLng();
    }
    var aveX=xSum/nodes.length;
    var aveY=ySum/nodes.length;
    var aveNode = new Node(aveX,aveY); 
    var x="Weighted Average Geolocation: (" + aveNode.getLat() +"," + aveNode.getLng() + ")";
    document.getElementById("panel").innerHTML=x;
    return aveNode;
}


//google functions
function codeLatLong(map){

    var infowindow = new google.maps.InfoWindow();
    var input = document.getElementById('latlng').value;
    var latlngStr = input.split(',', 2);
    var lat = parseFloat(latlngStr[0]);
    var lng = parseFloat(latlngStr[1]);
    var latlng = new google.maps.LatLng(lat, lng);
    var info = 'New node: ';
    geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP
        });

        infowindow.setContent(info + results[1].formatted_address);
        infowindow.open(map, marker);

        //add the node to the array of nodes
        var newStore= new Node (lat, lng);
        nodes.push(newStore);

      } else {
        alert('No results found');
      }
    } else {
      alert('Geocoder failed due to: ' + status);
    }
  });
}



function addMarkers2() {
    var image='http://www.elyoukey.com/bloodbowl/dice/dot.png'
    var bounds = map.getBounds();
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    var lngSpan = northEast.lng() - southWest.lng();
    var latSpan = northEast.lat() - southWest.lat();
    for (var i = 0; i < 5; i++) {
        var latLng = new google.maps.LatLng(southWest.lat() + latSpan * Math.random(),
                                            southWest.lng() + lngSpan * Math.random());
        var marker = new google.maps.Marker({
                                            position: latLng,
                                            draggable: true,
                                            map: map,
                                            });
    }
    
}