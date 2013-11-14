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
function Cost(input){
    var MAX_COST = 100000;
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
    }
}

//calculate the weighted average of nodes
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
    //boundaries
    var COST_DST_RATIO = 0.001;
    var MAX_LAT = 60;
    var MIN_LAT = 48;
    var MAX_LNG = -105;
    var MIN_LNG = -130;
// GRANULARITY
    var THL_COST = 10000;
    var GRL = 10;
    var NUM_ELLIPSES = 2;
    
            
    var THERESHOLD= 0.002;
    var STEPSIZE = 0.001;
    var ellipse = [];
    var point;
    var steps;
    var thl;
    var diff;
    var min = 1000;
    var FW_point = new Node; 
    var cost_step = document.getElementById('coststep').value;
    var init_cost = new Cost(document.getElementById('cost').value);
    if (!init_cost.status()){
        alert ('Entered cost parameter is not valid!');
        return false;
    }
    
    //tune the granularity based on the initial cost    
    if (init_cost.cost>THL_COST){ 
        steps = STEPSIZE*GRL;
        thl = THERESHOLD*GRL; 
    }
    else{
        steps = STEPSIZE;
        thl = THERESHOLD;
    }
    initial_c=init_cost.cost;
    for (m=0; m<NUM_ELLIPSES; m++){
        
    var dist = initial_c*COST_DST_RATIO; 
    
    
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
    initial_c -= cost_step;
    drawEllipse(map, ellipse);
    
    }
                
       new google.maps.Marker({                              
                    position: new google.maps.LatLng(FW_point.getLat(), FW_point.getLng()),
                    draggable: false,
                    map: map,
                    icon:image2,
                    title: 'FW POINT',
                    zIndex: AVE_ZINDEX,
                    animation: google.maps.Animation.DROP
                    }); 
      var x="Minimum Distance: " + min;
      document.getElementById("panel").innerHTML=x;

    return ellipse;
}

function drawEllipse(map, points){
    var path = [];
    for (i=0;i<points.length;i++)
            {
                path.push(new google.maps.LatLng(points[i].getLat(),points[i].getLng()));
            };
    var shape = new google.maps.Polygon({
                paths: path,
                strokeColor: '#000000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillOpacity: 0
                });
    shape.setMap(map);    
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


