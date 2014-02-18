function updateDistMatrix(stores)
{
	/* update global variable distMat */
	distMat = distanceMatrix(stores);
}

function distFromDCToStores (DC, stores)
{
	if (DC == null)
		return null;
	else
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
}

/* Calculates the fitness value of each route.
 * Has a lot of similarity with totalDistance().
 * DC must be already defined. */
function off_routing_distance(routes, brks)
{
	var paths = new Array(brks.length + 1);
	
	if (brks.length == 0)
	{
		paths[0] = new Array(DC);
		paths[0] = paths[0].concat(routes);
	} else {
		paths[0] = new Array(DC);
		paths[0] = paths[0].concat(routes.slice(0, brks[0]+1));
		for (var i = 1; i < brks.length; i++)
		{
			paths[i] = new Array(DC);
			paths[i] = paths[i].concat(routes.slice(brks[i-1]+1, brks[i]+1));  
		}
		// last path
		paths[brks.length] = new Array(DC);
		paths[brks.length] = paths[brks.length].concat(routes.slice(brks[brks.length-1]+1)); 
	}
	
	// distances will store the distances that need to be traveled in each paths
	var distances = new Array(paths.length);
	
	var DCStoresDist = distFromDCToStores(DC, stores);
	for (var i = 0; i < distances.length; i++)
	{
		distances[i] = new Array();
		distances[i].push(DCStoresDist[paths[i][1]]); // first distance
	}
	
	// using the global variable distMat
	distMat = distanceMatrix(stores);
	
	for (var i = 0; i < paths.length; i++) // traverse each path
	{		
		for (var j = 1; j < paths[i].length - 1; j++) // traverse paths[i]
		{
		//	console.log("Dist[" + paths[i][j] + "][" + paths[i][j+1] + "] = " + distMat[paths[i][j]][paths[i][j+1]]); // showing all the distances involve to check if it's correct
			distances[i].push(distMat[paths[i][j]][paths[i][j+1]]);
		}
	}
	
	// total will store the total distance of each path (ie each truck's total distance)
	var total = new Array(distances.length);
	for (var i = 0; i < distances.length; i++)
	{
		var sum = new Number(0);
		for (var j = 0; j < distances[i].length; j++)
		{
			sum += Number(distances[i][j]);
		}
		total[i] = sum;
	}
	
	var offRouteDist = new Array(total.length);
	for (var i = 0; i < offRouteDist.length; i++)
	{
		offRouteDist[i] = total[i] - DCStoresDist[paths[i][ paths[i].length - 1 ]];
	}
	
	return offRouteDist;
}

/* 	Calculates the total distance of the routes solution. 
	For now it uses the one DC that user input */
function totalDistance(routes, brks)
{
	
	/* test */
	//routes = [1, 5, 4];
	//brks = [];
	//routes = [1, 5, 4, 2, 3, 6, 7, 9, 8];
	//brks = [2, 4];
	/* end test */	
	
	// paths will store the list of stores' indices of each path
	var paths = new Array(brks.length + 1);
	
	if (brks.length == 0)
	{
		paths[0] = new Array(DC);
		paths[0] = paths[0].concat(routes);
	} else {
		paths[0] = new Array(DC);
		paths[0] = paths[0].concat(routes.slice(0, brks[0]+1));
		for (var i = 1; i < brks.length; i++)
		{
			paths[i] = new Array(DC);
			paths[i] = paths[i].concat(routes.slice(brks[i-1]+1, brks[i]+1));  
		}
		// last path
		paths[brks.length] = new Array(DC);
		paths[brks.length] = paths[brks.length].concat(routes.slice(brks[brks.length-1]+1)); 
	}
	
	// distances will store the distances that need to be traveled in each paths
	var distances = new Array(paths.length);
	
	// If DC is defined, get the distance from DC to the first store
	if (DC != null)
	{
		var DCStoresDist = distFromDCToStores(DC, stores);
	//	console.log(DCStoresDist);
		for (var i = 0; i < distances.length; i++)
		{
			distances[i] = new Array();
		//	console.log("DCToStores-" + paths[i][1] + "dist = " + DCStoresDist[paths[i][1]]);
			distances[i].push(DCStoresDist[paths[i][1]]);
		}
	} else {
	// else just create a blank array
		for (var i = 0; i < paths.length; i++)
		{
			distances[i] = new Array();
		}
	}
	
	// using the global variable distMat
	distMat = distanceMatrix(stores);
	
	for (var i = 0; i < paths.length; i++) // traverse each path
	{		
		for (var j = 1; j < paths[i].length - 1; j++) // traverse paths[i]
		{
		//	console.log("Dist[" + paths[i][j] + "][" + paths[i][j+1] + "] = " + distMat[paths[i][j]][paths[i][j+1]]); // showing all the distances involve to check if it's correct
			distances[i].push(distMat[paths[i][j]][paths[i][j+1]]);
		}
	}
	
	// total will store the total distance of each path
	var total = new Array(distances.length);
	for (var i = 0; i < distances.length; i++)
	{
		var sum = new Number(0);
		for (var j = 0; j < distances[i].length; j++)
		{
			sum += Number(distances[i][j]);
		}
	//	console.log("sum" + i + "= " + sum);
		total[i] = sum;
	}
	
	// totSum stores the total distance of all the paths
	var totSum = new Number(0);
	for (var i = 0; i < total.length; i++)
	{
		totSum += Number(total[i]);
	}
	
	//console.log("totSum = " + totSum);
	return totSum;
}

/*	Draws the paths based on the given routes and brks.
	The content of brks must be in increasing order */
function graph_groups(map, routes, brks)
{
        if (drawPath!= undefined){
            
            drawPath.setMap(null);
            
        }
	
	if (routes <= 0)
	{	
		alert("Error in array length in graph_groups()");
		return 0;
	}
	
	// no. of paths will always be 1 more than no. of breaks.
	// If the last element in brks is the last index of routes, the last path will draw nothing
	var paths = new Array(brks.length + 1);

	var j = 0;
        
//        if(DC=undefined){
//                // Hardcode DC
//                DC = new Node(49.06277778, -121.52638890000003);
//        }
        
	for (var i = 0; i < paths.length; i++)
	{
		paths[i] = new Array();
        paths[i].push(new google.maps.LatLng(DC.getLat(), DC.getLng()));
				
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
                //console.log(paths[i]);
	}
	
	// Paths color
	var colorCode = ['#000000', '#336699', '#339933', '#660066', '#9966FF', '#663300', '#660066', '#A366A3', '#800000', '#808000', '#008000', '#800080', '#008080', '#0000880', '#FF4500'];

        if (oldPath){
            
            for (x in oldPath)
            oldPath[x].setMap(null);

        }
        oldPath = [];
        
	for (var i = 0; i < paths.length; i++)
	{
		var drawPath = new google.maps.Polyline({
			path: paths[i],
			geodesic: true,
			strokeColor: colorCode[i % colorCode.length],
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		
		oldPath.push(drawPath);
                drawPath.setMap(map);
                
	}
        
}

/*	Calculates the Euclidean distance between the stores and returns it in a matrix.
	Have to call updateDistMatrix() every time the markers (ie. the stores) change. */
function distanceMatrix(stores)
{		
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


function rand_routes(trucks, rand_arr)
{
	/* Shuffle the rand_arr based on Fisher-Yates Shuffle Modern Algorithm */
	var i = rand_arr.length, j, temp;
	while (i--)
	{
		j = Math.floor(Math.random() * (i+1));
		temp = rand_arr[j];
		rand_arr[j] = rand_arr[i];
		rand_arr[i] = temp;
	}
	
	/* check */
	//console.log(rand_arr);
	
	return rand_arr;
}

// generating random breaks
function rand_breaks (trucks, length, min_tour){
	var breaks = new Array(trucks - 1);
        
	var start = min_tour - 1;
        var end = 0;
        
	for (var i = 0; i < trucks - 1; i++)
	{
            end  = (length - 1) - (min_tour * (trucks - 1 - i));
            breaks[i] = random_int (start, end);
            start = breaks[i] + min_tour;
	}
        //console.log(breaks);
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
        var active_stores = []; 
        var k = stores.length;
	
	// generate an array filled with stores indices that are not null
	while(k--)
	{
		if (stores[k] != null)
			active_stores.push(k);
	}

       return active_stores;
}

function group_progress(){
    
    var progbar = 0;
    var myprog = 0;
    document.getElementById('panel12').appendChild(progress);
    popSize = document.getElementById('pop-size').value; 
    trucks = document.getElementById('no-trks').value;
    var pBreaks = new Array(popSize);
    var pRoutes = new Array(popSize);
    var not_null_stores = non_null_indices(stores);
    var k = popSize;
    var k1;
    var grouping =setInterval(function(){
        
             k1=k-(popSize/10);
             while(k>k1){
             pBreaks[k] = rand_breaks (trucks, non_null_size(stores), min_tour);
             pRoutes[k] = rand_routes (trucks, not_null_stores);
             progbar = (myprog++/popSize)*100;
             k--;
            }
            
             updateProgress(progbar);
             if (k<0){
                clearInterval(grouping);
                progbar = 100;
                updateProgress(progbar);
                console.log(pRoutes[5]);
                console.log(pBreaks[5]);
                graph_groups(map, pRoutes[5], pBreaks[5]);
             }

    },0);
    

}