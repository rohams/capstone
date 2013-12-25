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
function Weight(id,A1,A2,A3,A4,A5,A6,A7,F1,F2,F3,F4,F5,F6,F7,P1,P2,P3,P4,P5,P6,P7,AC1,AC2,AC3,AC4,AC5,AC6,AC7,FC1,FC2,FC3,FC4,FC5,FC6,FC7,PC1,PC2,PC3,PC4,PC5,PC6,PC7){
    
    this.id=id;
    this.A1=A1;
    this.A2=A2;
    this.A3=A3;
    this.A4=A4;
    this.A5=A5;
    this.A6=A6;
    this.A7=A7;
    
    this.F1=F1;
    this.F2=F2;
    this.F3=F3;
    this.F4=F4;
    this.F5=F5;
    this.F6=F6;
    this.F7=F7;
    
    this.P1=P1;
    this.P2=P2;
    this.P3=P3;
    this.P4=P4;
    this.P5=P5;
    this.P6=P6;
    this.P7=P7;
    
    this.AC1=AC1;
    this.AC2=AC2;
    this.AC3=AC3;
    this.AC4=AC4;
    this.AC5=AC5;
    this.AC6=AC6;
    this.AC7=AC7;
    
    this.FC1=FC1;
    this.FC2=FC2;
    this.FC3=FC3;
    this.FC4=FC4;
    this.FC5=FC5;
    this.FC6=FC6;
    this.FC7=FC7;
    
    this.PC1=PC1;
    this.PC2=PC2;
    this.PC3=PC3;
    this.PC4=PC4;
    this.PC5=PC5;
    this.PC6=PC6;
    this.PC7=PC7;
    
    this.A=0;
    this.F=0;
    this.P=0;
    
    this.AC=0;
    this.FC=0;
    this.PC=0;
    
    this.total=0;
    
    this.setWeight= function(){    
        this.A=(this.A1*sun)+(this.A2*mon)+(this.A3*tue)+(this.A4*wed)+(this.A5*thu)+(this.A6*fri)+(this.A7*sat);
        this.F=(this.F1*sun)+(this.F2*mon)+(this.F3*tue)+(this.F4*wed)+(this.F5*thu)+(this.F6*fri)+(this.F7*sat);
        this.P=(this.P1*sun)+(this.P2*mon)+(this.P3*tue)+(this.P4*wed)+(this.P5*thu)+(this.P6*fri)+(this.P7*sat);
        
        this.AC=(this.AC1*sun)+(this.AC2*mon)+(this.AC3*tue)+(this.AC4*wed)+(this.AC5*thu)+(this.AC6*fri)+(this.AC7*sat);
        this.FC=(this.FC1*sun)+(this.FC2*mon)+(this.FC3*tue)+(this.FC4*wed)+(this.FC5*thu)+(this.FC6*fri)+(this.FC7*sat);
        this.PC=(this.PC1*sun)+(this.PC2*mon)+(this.PC3*tue)+(this.PC4*wed)+(this.PC5*thu)+(this.PC6*fri)+(this.PC7*sat);
        
        this.total=this.A*w_ambient+this.F*w_frozen+this.P*w_perishable+this.AC*v_ambient+this.FC*v_frozen+this.PC*v_perishable;
    };
    
    this.getID = function()
    {
        return this.id;
    };
    this.getWeight= function()
    {
        return this.total;
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
    var MAX_COST = 2000000;
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
    };
    this.getName = function()
    {
        return this.name;
    };
}

//calculate the weighted average of nodes
function getWeightedAverage(stores){
    normalizeWeights();
    var xSum = 0;
    var ySum = 0;
    var count = 0;
    for (i=0;i<stores.length;i++)
    {
        if (stores[i] != null) {
            xSum += (stores[i].getLat())*stores[i].getWeight();
            ySum += (stores[i].getLng())*stores[i].getWeight();
            count +=stores[i].getWeight();
        }
    }
    var aveX = xSum/count;
    var aveY = ySum/count;
    var aveNode = new Node(aveX,aveY); 
    var x = "Weighted Average Geolocation: (" + aveNode.getLat() +"," + aveNode.getLng() + ")";
    document.getElementById("panel").innerHTML = x;
    return aveNode;
}

//calculate the average of nodes
function getAverage(stores){
    var xSum = 0;
    var ySum = 0;
    var count = stores.length;
    for (i=0;i<stores.length;i++)
    {
        if (stores[i] != null) {
            xSum += stores[i].getLat();
            ySum += stores[i].getLng();
        }
        else{
-            count--;
        }
    }
    var aveX = xSum/count;
    var aveY = ySum/count;
    var aveNode = new Node(aveX,aveY); 
    var x = "Weighted Average Geolocation: (" + aveNode.getLat() +"," + aveNode.getLng() + ")";
    document.getElementById("panel").innerHTML = x;
    return aveNode;
}

function distance(point1, point2){
    return Math.sqrt( Math.pow(point1.getLat() - point2.getLat(), 2) + Math.pow(point1.getLng() - point2.getLng(), 2) );
}


function SumOfDistances(foci,i,j){
    var distance = 0;      
    for (k = 0; k < foci.length; k++) {
        if (foci[k] != null) {
            distance += foci[k].getWeight()*(Math.sqrt( Math.pow(foci[k].getLat() - i, 2) + Math.pow(foci[k].getLng() - j, 2) ));
        }
    }
    return distance;    
}
 
 
// a function to draw ellipse based on cost
function getEllipse(foci,map){
//set boundaries
    var MAX_LAT = 65;
    var MIN_LAT = 34;
    var MAX_LNG = -100;
    var MIN_LNG = -135;
//GRANULARITY
    var height = 0;
    var set_grl = true;
    var THERESHOLD= 0.009;
    var STEPSIZE = 0.004;
    var ellipse = [];
    var lngs = [];
    var point;
    var steps;
    var thl;
    var min;
    var max_lng, min_lng, mid_lng;
    var FW_point = new Node; 
    var cost_step = document.getElementById('coststep').value;
    var init_cost = new Cost(document.getElementById('cost').value);
    normalizeWeights();
    if (!init_cost.status()){
        alert ('Entered cost parameter is not valid!');
        return false;
    }
    var d;
    var cost = init_cost.cost;
    //dynamically tune the granularity based on the initial cost    
    steps = STEPSIZE;
    thl = THERESHOLD;
    //remove last drawing
    removeLastDraw(); 
    var ave = getWeightedAverage(foci); 
    mid_lng = ave.getLng();
    //draw new ellipses
    while(cost>0){
    var dist = cost*DST_CST_RATIO; 
    //initialize min variable for finding the FW point
    var min = dist;
    //sweep the right side
    for (i = MIN_LAT; i < MAX_LAT; i += steps) {
            for (j = mid_lng; j < MAX_LNG; j += steps) {
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
                        if(set_grl){
                            set_grl=false;
                            height = distance(point,ave);
                            steps = STEPSIZE*height;
                            thl=THERESHOLD*height*norm_weight_ave;
                        }
                        lngs.push(j);
                        ellipse.push(point);
                        break;
                    }
            }
     }
      //get the highest LAT LNG
      
      if(ellipse[ellipse.length-1]!=undefined)
      {
         var highest_lat = ellipse[ellipse.length-1].getLat();
         var highest_lng = ellipse[ellipse.length-1].getLng();
      }
      //get the lowest LAT LNG
      if(ellipse[0]!=undefined)
      {
         var lowest_lat = ellipse[0].getLat();
      }
      //sweep up
      for (j = highest_lng; j > MIN_LNG; j -= steps) {
                for (i = highest_lat; i < MAX_LAT; i += steps) {
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
                            lngs.push(j);
                            break;
                        }				
                }
      }     
      
      if(ellipse[ellipse.length-1]!=undefined)
      {
         var final_lat = ellipse[ellipse.length-1].getLat();
         var final_lng = ellipse[ellipse.length-1].getLng();
      }
      
     //sweep the left side           
     for (i = final_lat; i > lowest_lat; i -= steps) {
                    for (j = final_lng; j > MIN_LNG; j -= steps) {
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
                                lngs.push(j);
                                break;
                            }				
                    }
        }
        
      if(ellipse[ellipse.length-1]!=undefined)
      {
         final_lat = ellipse[ellipse.length-1].getLat();
         final_lng = ellipse[ellipse.length-1].getLng();
      }
      
      //sweep down
      for (j = final_lng; j < mid_lng; j += steps) {
                for (i = final_lat; i > MIN_LAT; i -= steps) {
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
                            lngs.push(j);
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
        //find new average
        max_lng = Math.max.apply(Math,lngs);
        min_lng = Math.min.apply(Math,lngs);
        mid_lng=(max_lng+min_lng)/2;
        ellipse = [];
        lngs = [];
        //tune granularity for next ellipse
        set_grl=true;
    }
    
       //mark FW point         
       FW_marker = new google.maps.Marker({                              
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
      var x="Minimum Distance: " + min + " granularity: " + steps;
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
//remove last drawing
function removeLastDraw(){
    for(x in shapes){
        shapes[x].setVisible(false);
        shapes[x].setMap(map);
    }
    for (x in pathInfos){
        pathInfos[x].close(map);
    }
    if(FW_marker!=undefined){
        FW_marker.setMap(null);
    }
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
    var x = "Removed a store at (" + stores[marker_id].getLat() + ", " + stores[marker_id].getLng() + ")";
    marker.setMap(null);
    stores[marker_id] = null;
    markers[marker_id] = null;    
    document.getElementById("panel").innerHTML = x;
}

//add a single node
function addNode(map){
    
    manual_add_id++;
    var infowindow = new google.maps.InfoWindow();
    var input1 = document.getElementById('lat').value;
    var input2 = document.getElementById('lng').value;
    var input3 = document.getElementById('weight').value;
    var lat = parseFloat(input1);
    var lng = parseFloat(input2);
    var wgt = parseFloat(input3);
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
        
        google.maps.event.addListener(marker, 'click', function() {
                markerInfoWin(this);
            });

        //Add listeners for Removing markers
         google.maps.event.addListener(marker, 'dblclick', function() {
           removeMarker(this);
        });
        var store_id="manually-added-"+manual_add_id;
        //add the node to the array of nodes
        var newStore= new Store (lat, lng, -1, store_id, wgt);
        var total_w = new Tot_weight(-1, wgt); 
        stores.push(newStore);
        imported.push(newStore);
        tot_weights.push(total_w);
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


//add a DC node
function addDC(map){
    removeLastDraw();
    var panel7=true;
    if(typeof(dcmarker) != "undefined"){
        dcmarker.setMap(null);
    }  
    var infowindow = new google.maps.InfoWindow();
    var input1 = document.getElementById('dc-lat').value;
    var input2 = document.getElementById('dc-lng').value;
    var lat = parseFloat(input1);
    var lng = parseFloat(input2);
    var latlng = new google.maps.LatLng(lat, lng);
    var info = 'Distribution Center: ';
    geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
         if(panel7){
            document.getElementById("panel7").style.display = 'block';
            panel7=false;
        }  
        dcmarker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        strokeColor: 'red',
                        fillOpacity: 0.8,
                        scale: 6
                      },
            animation: google.maps.Animation.DROP
        });

        infowindow.setContent(info + results[1].formatted_address);
        infowindow.open(map, dcmarker);
        //Add listeners for Removing markers
         google.maps.event.addListener(dcmarker, 'dblclick', function() {
        dcmarker.setMap(null);
        var x = "Removed the DC";
        document.getElementById("panel").innerHTML = x;
        document.getElementById("panel7").style.display = 'none'; 
        panel7=true;
        });
        DC = new Node(lat,lng);       
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

function updateWeights(){
    for (x in tot_weights){
        //-1 is for the stores that are added manually
        if(tot_weights[x].getID()!=-1){
            weights[x].setWeight();
            tot_weights[x].setWeight(weights[x].getWeight());
        }
    }
    normalizeWeights();
}

//normalize weights 
function normalizeWeights(){
    var min = MAX_WEIGHT;
    var sum =0;
    var count=0;
    //calculating the min
    for (s in stores){
        if(stores[s]!=null){
            for (x in tot_weights){
                if(stores[s].getExt()==tot_weights[x].getID()){
                    if(tot_weights[x].getWeight()!=0){
                        count++;
                        if(tot_weights[x].getWeight()<min){
                            min=tot_weights[x].getWeight();
                        }
                    }
                    break;
                }
            }
        }
    }
    //dividing weight by min
    for (s in stores){
        if(stores[s]!=null){
            //if the imported store from the first file
            // is not in the second file assign zero
            if (stores[s].getSub()!=-1){
                stores[s].setWeight(0);
            }
            else{
                sum +=stores[s].getWeight();
                count++;
            }
            for (x in tot_weights){
                if(tot_weights[x].getID()!=-1){
                    if(stores[s].getExt()==tot_weights[x].getID()){
                        var new_weight=tot_weights[x].getWeight()/min;
                        stores[s].setWeight(new_weight);
                        sum += new_weight;
                        break;
                    }   
                }
            }
        }
    }
    norm_weight_ave=sum/count;
    var output = "Ave of weights " + norm_weight_ave;
    document.getElementById("panel").innerHTML = output;
}

function nodeToRemove(){
    var max=0;
    var mymarker;
    var node;
    for (x in stores){
        if (stores[x] != null) {
            node=new Node(stores[x].getLat(),stores[x].getLng());
            var temp =stores[x].getWeight()*distance(node,DC);
            if (temp>max){
                max=temp;
                mymarker=markers[x];
            }
        }
    }
    return mymarker;
}

function bounceNextNode(){
    var mymarker=nodeToRemove();
    toggleBounce(mymarker);
    
}

function toggleBounce(mymarker) {

  if (mymarker.getAnimation() != null) {
    mymarker.setAnimation(null);
  } else {
    mymarker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

function selOption()
{
    var mylist=document.getElementById("opts");
    var option=mylist.options[mylist.selectedIndex].text;
    if (option=="Add next node"){
        document.getElementById("panel8").style.display = 'none'; 
    }
    if (option=="Remove next node"){
        document.getElementById("panel8").style.display = 'block'; 
    }
    if (option=="Store Grouping"){
        document.getElementById("panel8").style.display = 'none'; 
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

    var title=document.createTextNode("Week days");
    //title.style.fontWeight = "bold";
    document.getElementById("panel44").appendChild(title);
    document.getElementById("panel44").style.display = 'block'; 
    for (i=0;i<days.length; i++){
                var node = document.createElement("DIV");
                node.id = 'day_' + i;
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = i;
                checkbox.id = 'ch_day_'+ i;
                var textnode=document.createTextNode(days[i]);
                document.getElementById("panel4").appendChild(node);
                node.appendChild(checkbox);
                node.appendChild(textnode); 
                document.getElementById('panel4').style.marginBottom = '10px';
            };
     var title2=document.createTextNode("Commodity by weight");
     document.getElementById("panel55").style.display = 'block'; 
     document.getElementById("panel55").appendChild(title2);
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
     var title3=document.createTextNode("Commodity by volume");
     document.getElementById("panel99").style.display = 'block'; 
     document.getElementById("panel99").appendChild(title3);
     for (i=0;i<cmds.length; i++){
                var node = document.createElement("DIV");
                node.id = 'cmd_c_' + i;
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = i;
                checkbox.id = 'ch_cmd_c'+ i;
                var textnode=document.createTextNode(cmds[i]);
                document.getElementById("panel9").appendChild(node);
                node.appendChild(checkbox);
                node.appendChild(textnode); 
                document.getElementById('panel9').style.marginBottom = '10px';
            };
       
};