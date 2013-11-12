//constructor 
function Node(lat,lng){
    this.lat=lat;
    this.lng=lng;
    
    this.getLat = function()
    {
        return this.lat;
    };
    
    this.getLng = function()
    {
        return this.lng;
    };
}

//calculate the weighted average of nodes
function getAverage(nodes){
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


function SumOfDistances(foci,i,j){
    var distance = 0;
    for (k = 0; k < foci.length; k++) {
        distance += Math.sqrt( Math.pow(foci[k].getLat() - i, 2) + Math.pow(foci[k].getLng() - j, 2) );
    }
    return distance;    
}

function drawEllipse(foci){
    var COST= 2.5;
    var THERESHOLD= 2;
    var STEPSIZE= 0.01;
    var ellipse = [];
    var ave = getAverage(foci); 
    for (i=49.14; i < 49.40; i += STEPSIZE) {
			for (j = ave.getLng(); j < -122.95; j += STEPSIZE) {
				d = SumOfDistances(foci, i, j);
                                d -= COST;
                                if (Math.abs(d) < THERESHOLD) {
                                    var point= new Node(i,j);
                                    ellipse.push(point);
                                    break;
                                }				
			}
		}
                
     for (i = 49.40; i > 49.14; i -= STEPSIZE) {
			for (j = ave.getLng(); j > -123.25; j -= STEPSIZE) {
				d = SumOfDistances(foci, i, j);
                                d -= COST;
                                if (Math.abs(d) < THERESHOLD) {
                                    var point= new Node(i,j);
                                    ellipse.push(point); 
                                    break;
                                }				
			}
		}
                
    return ellipse;
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
        
        //add marker to markers array
        markers.push(marker);

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