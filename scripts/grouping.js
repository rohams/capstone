function updateDistMatrix(stores)
{
	/* update global variable distMat */
	distMat = distanceMatrix(stores);
}

function distFromDCToStores (DC, stores)
{
	var dcDist = new Array(stores.length);
	
	for (var i = 0; i < stores.length; i++)
	{
		if (stores[i] != null)
		{
			dcDist[i] = distHaversine(DC, stores[i]);
		}
		else
			dcDist[i] = null;
	}
	return dcDist;
}

function graph_groups(map, routes, brks)
{	
	/* Draws the paths based on the given routes and brks.
	   Must make sure that the content of brks is in increasing order */
	
	/* Test data */
	// empty array
//	routes = new Array();
	// one data
//	routes = [9]; // AB North
	// multiple data
    routes = new Array(0, 9, 35, 36, 43, 64, 92, 96, 103, 104, 105, 106, 108, 110, 111, 112, 113, 114, 115, 116, 117);
	brks = new Array(4, 7, routes.length-1);
	
	if (routes <= 0)
	{	
		alert("Error in array length in graph_groups()");
		return 0;
	}
	
	// no. of paths will always be 1 more than no. of breaks.
	// If the last element in brks is the last index of routes, the last path will draw nothing
	var paths = new Array(brks.length + 1);

	var j = 0;
	
	for (var i = 0; i < paths.length; i++)
	{
		paths[i] = new Array();
		
                if(DC!=undefined){
                    paths[i].push(new google.maps.LatLng(DC.getLat(), DC.getLng()));
                }
                else{
                    // Hardcode DC
                    paths[i].push(new google.maps.LatLng(49.06277778, -121.52638890000003));
                }
				
		for (j; j < routes.length; j++)
		{
			if (j != brks[i]) // brks must be in increasing order!
			{	
				if (stores[routes[j]] != null)
				{
					paths[i].push( new google.maps.LatLng(stores[routes[j]].getLat(), stores[routes[j]].getLng() ));
				}
			} else {
				// brks indicate where is the last store of the current path.
				if (stores[routes[j]] != null)
					paths[i].push( new google.maps.LatLng(stores[routes[j]].getLat(), stores[routes[j]].getLng() ));
				j++;
				break;
			}
		}
	}
	
	// Paths color
	var colorCode = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#808080', '#800000', '#808000', '#008000', '#800080', '#008080', '#0000880', '#FF4500'];
	
	for (var i = 0; i < paths.length; i++)
	{
		var drawPath = new google.maps.Polyline({
			path: paths[i],
			geodesic: true,
			strokeColor: colorCode[i % colorCode.length],
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		
		drawPath.setMap(map);
	}
}

function distanceMatrix(stores)
{	
	/* Calculates the Euclidean distance between the stores and returns it in a matrix.
	   Have to call updateDistMatrix() every time the markers (ie. the stores) change. */
	
	var totSelectedStores = 0;
	
	// Create a two dimensional array of stores.length by stores.length
	var distMat = new Array(stores.length);
	for (var k=0; k < stores.length; k++)
		distMat[k] = new Array(stores.length);
	
	
	for (var i=0; i < stores.length; i++)
	{	
		// Only do calculation for selected (displayed) stores
		if (stores[i] != null)
		{
			totSelectedStores++;
			
			var j = i; // It's a symmetric matrix
			
			for (j; j < stores.length; j++)
			{
				if (stores[j] != null)
				{
					var dist = distHaversine(stores[i], stores[j]);					
					distMat[i][j] = dist;
					distMat[j][i] = dist;
					
					/* check */
				//	console.log("dist[" + i + "][" + j + "] = " + distMat[i][j]);
				//	console.log("store id[" + i + "] = " + stores[i].getExt() +"\nstore id[" + j + "] = " + stores[j].getExt());
				} else {
					distMat[i][j] = null;
					distMat[j][i] = null;
				}
			}
		} else {
			for (var j = i; j < stores.length; j++)
			{	
				distMat[i][j] = null;
				distMat[j][i] = null;
			}
		}
	}
	
	/* Check */
	console.log("Total selected stores = " + totSelectedStores );
	
	return distMat;
}

//calculating distance in km
rad = function(x) {return x*Math.PI/180;}

distHaversine = function(p1, p2) {
  var R = 6371; // earth's mean radius in km
  var dLat  = rad(p2.getLat() - p1.getLat());
  var dLong = rad(p2.getLng() - p1.getLng());

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad(p1.getLat())) * Math.cos(rad(p2.getLat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d.toFixed(3);
}


function rand_stores()
{
	/* Generates random array of stores indices that are not null. Cannot have repeated values */
	
	var rand_arr = [];
	var k = stores.length;
	
	// generate an array filled with stores indices that are not null
	while(k--)
	{
		if (stores[k] != null)
			rand_arr.push(k);
	}
	
	// Shuffle the rand_arr based on Fisher-Yates Shuffle Modern Algorithm
	var i = rand_arr.length, j, temp;
	while (i--)
	{
		j = Math.floor(Math.random() * (i+1));
		temp = rand_arr[j];
		rand_arr[j] = rand_arr[i];
		rand_arr[i] = temp;
	}
	
	/* check */
	console.log(rand_arr);
	
	return rand_arr;
}

// generating random breaks
function rand_breaks (trucks, length, min_tour){
	var breaks = new Array(trucks - 1);
        
	var start = min_tour - 1;
        var end = 0;
        
	for (var i = 0; i < trucks - 1; i++)
	{
            end  = (stores - 1) - (min_tour * (trucks - 1 - i));
            breaks[i] = random_int (start, end);
            start = breaks[i] + min_tour;
	}
	return breaks;
}

// generating a random integer between min and max inclusive
function random_int (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function non_null_size(myArray){
    var length = 0;
    for (var i=0; i<myArray.length; i++){
        if (myArray[i] != null){
            length++;
        }
    }
    return length;
}

function non_null_indices(stores){
        var length = non_null_size(stores);
        var active_stores = new Array(length);
        for (var i=0; i<stores.length; i++){
            if (stores[i] != null){
                active_stores.push(i);
            }
        }
       return active_stores;
}

function group_progress2(){
    popSize = new Cost(document.getElementById('pop-size').value);
    trucks = new Cost(document.getElementById('no-trks').value);
    var pBreaks = rand_breaks (trucks, non_null_size(stores), min_tour);
    //var pRoute = rand_routes (trucks, stores);
}