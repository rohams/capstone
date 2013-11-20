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

//constructor 
function Store(lat,lng,sub_id){
    this.lat=lat;
    this.lng=lng;
    this.sub=sub_id;
    
    this.getLat = function()
    {
        return this.lat;
    };
    
    this.getLng = function()
    {
        return this.lng;
    };
    this.getSub = function()
    {
        return this.sub;
    };
    this.setSub = function(id)
    {
     this.sub = id;;
    };
}

//constructor
function Cost(input){
    var MAX_COST = 1000000;
    this.cost=input;
    this.getCost = function()
    {
        return this.cost;
    };
    this.status = function()
    {
            if (input>0){
        if(input<MAX_COST){
            return true;           
        }          
    }
    return false;
    };
}

//cunstructor
function Subnetwork(id,name){
    this.id=id;
    this.name = name;
    this.setName = function(input)
    {
        this.name= input;
    }
    this.getName = function()
    {
        return this.name;
    }
}

//calculate the average of nodes
function getAverage(nodes){
    var xSum = 0;
    var ySum = 0;
    var count = nodes.length;
    for (i=0;i<nodes.length;i++)
    {
        if (nodes[i] != null) {
            xSum += nodes[i].getLat();
            ySum += nodes[i].getLng();
        }
        else{
            count--;
        }
    }
    var aveX = xSum/count;
    var aveY = ySum/count;
    var aveNode = new Node(aveX,aveY); 
    var x = "Weighted Average Geolocation: (" + aveNode.getLat() +"," + aveNode.getLng() + ")";
    document.getElementById("panel").innerHTML = x;
    return aveNode;
}

//calculate the weighted average of nodes
//ADD function here

function SumOfDistances(foci,i,j){
    var distance = 0;      
    for (k = 0; k < foci.length; k++) {
        if (foci[k] != null) {
            distance += Math.sqrt( Math.pow(foci[k].getLat() - i, 2) + Math.pow(foci[k].getLng() - j, 2) );
        }
    }
    return distance;    
}

 
function getEllipse(foci,map){
    
//    var COST= 0.5;
//set boundaries
    var COST_DST_RATIO = 0.001;
    var MAX_LAT = 62;
    var MIN_LAT = 42;
    var MAX_LNG = -101;
    var MIN_LNG = -130;
//GRANULARITY
    var GRL = 0.0001;
    var THERESHOLD= 0.002;
    var STEPSIZE = 0.001;
    var ellipse = [];
    var point;
    var steps;
    var thl;
    var min = 1000;
    var FW_point = new Node; 
    var cost_step = document.getElementById('coststep').value;
    var init_cost = new Cost(document.getElementById('cost').value);
    if (!init_cost.status()){
        alert ('Entered cost parameter is not valid!');
        return false;
    }

    var cost = init_cost.cost;
    var dynamic_grl = cost*GRL;
    
    //dynamically tune the granularity based on the initial cost    
    steps = STEPSIZE*dynamic_grl;
    thl = THERESHOLD*dynamic_grl;
    
    //remove last drawing
        for(x in shapes){
        shapes[x].setVisible(false);
        shapes[x].setMap(map);
    }
    for (x in pathInfos){
        pathInfos[x].close(map);
    }
    
    //draw new ellipses
    while(cost>0){
        
    var dist = cost*COST_DST_RATIO; 
    var ave = getAverage(foci); 
    
    for (i = MIN_LAT; i < MAX_LAT; i += steps) {
			for (j = ave.getLng(); j < MAX_LNG; j += steps) {
				d = SumOfDistances(foci, i, j);
                                 if (d<min){
                                    min=d;
                                    FW_point.lat = i;
                                    FW_point.lng = j;
                                }    
                                if (d>dist){
                                    break;
                                }
                                d -= dist;                                                            
                                if (Math.abs(d) < thl) {
                                    point= new Node(i,j);
                                    ellipse.push(point);
                                    break;                                                                     
                                }
			}
		}
                
     for (i = MAX_LAT; i > MIN_LAT; i -= steps) {
			for (j = ave.getLng(); j > MIN_LNG; j -= steps) {
				d = SumOfDistances(foci, i, j);
                                if (d<min){
                                    min=d;
                                    FW_point.lat = i;
                                    FW_point.lng = j;
                                }
                                if (d>dist){
                                    break;
                                }
                                d -= dist;                                                             
                                if (Math.abs(d) < thl) {
                                    var point= new Node(i,j);
                                    ellipse.push(point); 
                                    break;
                                }				
			}
		}
                //Terminate
                if(ellipse.length==0){
                    break;
                }
                drawEllipse(map, ellipse, cost);
                cost -= cost_step;
                ellipse = [];    
    }
                
       new google.maps.Marker({                              
                    position: new google.maps.LatLng(FW_point.getLat(), FW_point.getLng()),
                    draggable: false,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 6
                      },
                    title: 'Fermat-Weber Point',
                    zIndex: AVE_ZINDEX,
                    animation: google.maps.Animation.DROP
                    }); 
      var x="Minimum Distance: " + min;
      document.getElementById("panel").innerHTML=x;

    return ellipse;
}

function drawEllipse(map, points, cost){
    var path = [];
    for (i=0;i<points.length;i++)
            {
                path.push(new google.maps.LatLng(points[i].getLat(),points[i].getLng()));
            };
    var shape = new google.maps.Polygon({
                paths: path,
                strokeColor: '#00000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillOpacity: 0,
                visible: true,
                clickable: false
                });
                
    var pathInfo = new google.maps.InfoWindow();
    var html = '$' + cost;
    pathInfo.setContent(html);
    pathInfo.setPosition(path[1]);
    pathInfo.open(map);
    shape.setMap(map);
    shapes.push(shape);
    pathInfos.push(pathInfo);
}

// Sets the map on all markers in the array.
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setAllMap(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}   

//remove markers by sub-network id
function removeMarkers(id){
        for (var i = 0; i < stores.length; i++) {
            if(stores[i]!=null){
                if(stores[i].getSub()==id){
                    markers[i].setMap(null);
                    markers[i] = null;
                    stores[i] = null;
                }
            }
        }
}

//remove a single marker
function removeMarker(marker){
    marker_id = markers.indexOf(marker);
    marker.setMap(null);
    stores[marker_id] = null;
    markers[marker_id] = null;
}

//add a single node
function addNode(map){

    var infowindow = new google.maps.InfoWindow();
    var input1 = document.getElementById('lat').value;
    var input2 = document.getElementById('lng').value;
    var lat = parseFloat(input1);
    var lng = parseFloat(input2);
    var latlng = new google.maps.LatLng(lat, lng);
    var info = 'New Store: ';
    geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
       var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            animation: google.maps.Animation.DROP
        });

        infowindow.setContent(info + results[1].formatted_address);
        infowindow.open(map, marker);

        //Add listeners for Removing markers
         google.maps.event.addListener(marker, 'dblclick', function() {
           removeMarker(this);
        });

        //add the node to the array of nodes
        //TODO: set the subnetwork
        var newStore= new Store (lat, lng, -1);
        stores.push(newStore);
        imported.push(newStore);
        
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

//add markers by sub-network id
function addMarkers(id) {
    for (var i = 0; i < imported.length; i++) {
        if(imported[i].getSub()==id){
            stores[i]=imported[i];
            var marker = new google.maps.Marker({
                                                position: new google.maps.LatLng(stores[i].getLat(), stores[i].getLng()),
                                                draggable: false,
                                                map: map
                                                });
 
            //Add info window
            google.maps.event.addListener(marker, 'click', function() {
                markerInfoWin(this);
            });
         
            //Add listeners for Removing markers
             google.maps.event.addListener(marker, 'dblclick', function() {
                removeMarker(this);

            });

            markers[i]=marker;
            var ave_point = getAverage(imported);
            var new_center = new google.maps.LatLng(ave_point.getLat(), ave_point.getLng());
            // Does this code suppose to make the ave_point as the center of the screen with proper zoom level?
            map.setCenter(new_center);
            map.setZoom(6);
        }
    }

}

//info window for each marker
function markerInfoWin(marker){
	if (openedInfoWindow != null) {
		openedInfoWindow.close();
	}
		infowindow = new google.maps.InfoWindow();
        var sub_name;
        var marker_id = markers.indexOf(marker);
        if (marker_id==-1){
        	infowindow.setContent( "<Store ID<br/>" + marker.position);
        } else {
        	sub_id = stores[marker_id].getSub();
        	sub_name = subs[sub_id];
            infowindow.setContent( "Store ID <br/> Sub-network: " + sub_name + "<br/>" + marker.position);
        }
        infowindow.open(map,marker);
        openedInfoWindow = infowindow;
}