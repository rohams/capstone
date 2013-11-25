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
function Tot_weight(id,weight){
    this.id=id;
    this.w=weight;
    
    this.addWeight = function(weight){
        this.w+=weight;
    };
    this.subWeight = function(weight){
        this.w-=weight;
    };
    this.setWeight = function(weight){
        this.w=weight;
    };
    this.getWeight = function(){
        return this.w;
    };
    this.getID = function(){
        return this.id;
    };
    
}


//constructor 
function Weight(id,A,F,P){
    this.id=id;
    this.A=A;
    this.F=F;
    this.P=P;
    this.getID = function()
    {
        return this.id;
    };
    this.getCmd = function(id)
    {
        switch(id)
        {
            case 0:
                return this.A;
            case 1:
                return this.F;
            case 2:
                return this.P;
        }
    };
}

//constructor 
function Store(lat,lng,sub_id,ext_id,weight){
    this.lat=lat;
    this.lng=lng;
    this.sub=sub_id;
    this.ext=ext_id;
    this.w=weight;
    
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
    
    this.getExt = function()
    {
        return this.ext;
    };
    
    this.getWeight = function()
    {
        return this.w;
    };
    
    this.setSub = function(id)
    {
     this.sub = id;;
    };
    
    this.setExt = function(id)
    {
     this.ext = id;;
    };
    
    this.setWeight = function(weight)
    {
     this.w = weight;;
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
    var x = "Successfully removed store at (" + stores[marker_id].getLat() + ", " + stores[marker_id].getLng() + ")";
    marker.setMap(null);
    stores[marker_id] = null;
    markers[marker_id] = null;    
    document.getElementById("panel").innerHTML = x;
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
						optimized: false,
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


//Add commodity type
function addCmd(id){
    for (x in tot_weights){
        tot_weights[x].addWeight(weights[x].getCmd(id));
    }
    normalizeWeights();    
}

//Remove commodity type
function removeCmd(id){
     for (x in tot_weights){
        tot_weights[x].subWeight(weights[x].getCmd(id));
    }
    normalizeWeights();
}

//normalize weights 
function normalizeWeights(){
    var sum = 0;
    //calculating the sum
    for (s in stores){
        if(stores[s]!=null){
            for (x in tot_weights){
                if(stores[s].getExt()==tot_weights[x].getID()){
                    sum+=tot_weights[x].getWeight();
                    break;
                }            
            }
        }
    }
    var output = "Sum of weights: "+sum;
    document.getElementById("panel").innerHTML = output;
    //deviding weight by the sum
    for (s in stores){
        if(stores[s]!=null){
            stores[s].setWeight(0);
            for (x in tot_weights){
                if(stores[s].getExt()==tot_weights[x].getID()){
                    var new_weight=tot_weights[x].getWeight()/sum;
                    stores[s].setWeight(new_weight);
                    break;
                }                
            }
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
        	var sub_id = stores[marker_id].getSub();
                var ext_id = stores[marker_id].getExt();                
            sub_name = subs[sub_id];
            var weight = stores[marker_id].getWeight();
            infowindow.setContent( "Store ID: "+ ext_id +"<br/> Sub-network: " + sub_name +"<br/> Calculated Weight: " + weight + "<br/>" + marker.position);
        }
        infowindow.open(map,marker);
        openedInfoWindow = infowindow;
}



function setWeightUI(){
    var days = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    var cmds = new Array("Ambient","Frozen","Perishable");
    var title=document.createTextNode("Week days:");
    //title.style.fontWeight = "bold";
    document.getElementById("panel4").appendChild(title);
    for (i=0;i<days.length; i++){
                var node = document.createElement("DIV");
                node.id = 'day_' + i;
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = i;
                checkbox.id = 'ch_day_'+ x;
                var textnode=document.createTextNode(days[i]);
                document.getElementById("panel4").appendChild(node);
                node.appendChild(checkbox);
                node.appendChild(textnode); 
                document.getElementById('panel4').style.marginBottom = '10px';
            };
     var title2=document.createTextNode("Commodities:");
     document.getElementById("panel5").appendChild(title2);
     for (i=0;i<cmds.length; i++){
                var node = document.createElement("DIV");
                node.id = 'cmd_' + i;
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = i;
                checkbox.id = 'ch_cmd_'+ i;
                var textnode=document.createTextNode(cmds[i]);
                document.getElementById("panel5").appendChild(node);
                node.appendChild(checkbox);
                node.appendChild(textnode); 
                document.getElementById('panel5').style.marginBottom = '10px';
            };
    
    
};