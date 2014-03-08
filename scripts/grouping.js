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

/*
 * Helper function
 * Break the given routes and brks into paths.
 * Return paths array.
 */
function get_paths(routes, brks)
{
	// save brks.length
	var brksLength = brks.length;
	var paths = new Array(brksLength + 1);
	
	if (brksLength == 0)
	{
		// Have to use concat method. 
		// Assignment operator will assign the reference of the array, not copy it.
		paths[0] = new Array();
		paths[0] = paths[0].concat(routes); 
	} else {
		paths[0] = new Array();
		paths[0] = paths[0].concat(routes.slice(0, brks[0] + 1));
		for (var i = 1; i < brksLength; i++)
		{
			paths[i] = new Array();
			paths[i] = paths[i].concat(routes.slice(brks[i-1]+1, brks[i]+1));
		}
		// last path
		paths[brksLength] = new Array();
		paths[brksLength] = paths[brksLength].concat(routes.slice(brks[brksLength-1] + 1));
	}
	
	return paths;
}

/*
 * Calculate the total stores' weight of each path.
 * Return an array of each path's total weight
 */
function route_cap(routes, brks)
{
	var paths = get_paths(routes, brks);
	var pathsLength = paths.length;
	var pathsWeight = new Array(pathsLength);
	
	// Now paths contain the stores' indices of of each path
	// Calculate sum of path weight
	for (var i = 0; i < pathsLength; i++)
	{
		var paths_iLength = paths[i].length;
		var sum = new Number(0);
		for (var j = 0; j < paths_iLength; j++)
		{
			sum += Stores(paths[i][j]).getDemand();
		}
		pathsWeight[i] = sum;
	}
	
	return pathsWeight;
}

/* Calculates the fitness value of each route.
 * Has a lot of similarity with totalDistance().
 * DC must be already defined. */
function off_routing_distance(routes, brks)
{
	var paths = get_paths(routes, brks);
	// save paths.length
	var pathsLength = paths.length;
	// Add DC as the starting point of each path
	for (var i = 0; i < pathsLength; i++)
	{
		paths[i].unshift(DC);
	}
	
	// distances will store the distances that need to be traveled in each paths
	var distances = new Array(pathsLength);
	
	var DCStoresDist = distFromDCToStores(DC, stores);
	for (var i = 0; i < pathsLength; i++)
	{
		distances[i] = new Array();
		distances[i].push(DCStoresDist[paths[i][1]]); // first distance
	}
	
	// using the global variable distMat
	distMat = distanceMatrix(stores);
	
	for (var i = 0; i < pathsLength; i++) // traverse each path
	{
		var path_iLength = paths[i].length;
		for (var j = 1; j < path_iLength - 1; j++) // traverse paths[i]
		{
		//	console.log("Dist[" + paths[i][j] + "][" + paths[i][j+1] + "] = " + distMat[paths[i][j]][paths[i][j+1]]); // showing all the distances involve to check if it's correct
			distances[i].push(distMat[paths[i][j]][paths[i][j+1]]);
		}
	}
	
	// total will store the total distance of each path (ie each truck's total distance)
	var distancesLength = distances.length;
	var total = new Array(distancesLength);
	for (var i = 0; i < distancesLength; i++)
	{
		var sum = new Number(0);
		var distances_iLength = distances[i].length;
		for (var j = 0; j < distances_iLength; j++)
		{
			sum += Number(distances[i][j]);
		}
		total[i] = sum;
	}
	
	var totOffRouteDist = new Number(0);
	var totalLength = total.length;
	for (var i = 0; i < totalLength; i++)
	{
		totOffRouteDist += Number( total[i] - DCStoresDist[paths[i][ paths[i].length - 1 ]] );
	}
	
	return totOffRouteDist;
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
	var paths = get_paths(routes, brks);
	// save paths.length
	var pathsLength = paths.length;
	// Add DC as the starting point of each path
	for (var i = 0; i < pathsLength; i++)
	{
		paths[i].unshift(DC);
	}
	
	// distances will store the distances that need to be traveled in each paths
	var distances = new Array(pathsLength);
	
	// If DC is defined, get the distance from DC to the first store
	if (DC != null)
	{
		var DCStoresDist = distFromDCToStores(DC, stores);
		for (var i = 0; i < pathsLength; i++)
		{
			distances[i] = new Array();
			distances[i].push(DCStoresDist[paths[i][1]]);
		}
	} else {
	// else just create a blank array
		for (var i = 0; i < pathsLength; i++)
		{
			distances[i] = new Array();
		}
	}
	
	// using the global variable distMat
	distMat = distanceMatrix(stores);
	
	for (var i = 0; i < pathsLength; i++) // traverse each path
	{	
		var paths_iLength = paths[i].length;
		for (var j = 1; j < paths_iLength - 1; j++) // traverse paths[i]
		{
		//	console.log("Dist[" + paths[i][j] + "][" + paths[i][j+1] + "] = " + distMat[paths[i][j]][paths[i][j+1]]); // showing all the distances involve to check if it's correct
			distances[i].push(distMat[paths[i][j]][paths[i][j+1]]);
		}
	}
	
	// total will store the total distance of each path
	var total = new Array(pathsLength);
	for (var i = 0; i < pathsLength; i++)
	{
		var sum = new Number(0);
		var distances_iLength = distances[i].length;
		for (var j = 0; j < distances_iLength; j++)
		{
			sum += Number(distances[i][j]);
		}
	//	console.log("sum" + i + "= " + sum);
		total[i] = sum;
	}
	
	// totSum stores the total distance of all the paths
	var totSum = new Number(0);
	var totalLength = total.length;
	for (var i = 0; i < totalLength; i++)
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
	// console.log("Total selected stores = " + totSelectedStores );
	
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


function rand_routes(myArr)
{
	/* Shuffle the rand_arr based on Fisher-Yates Shuffle Modern Algorithm */
        // copy the array instead of reference
        var rand_arr = myArr.slice();
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

function insertion(Route, Break, post_fitVal){
    
	optRoute = Route;
        optBreak = Break;
	var fitValHist = post_fitVal;
        var run = 1;
	var newBreak;
        var newRoute;
        
        var opt_cost;
        var opt_fitVal;
        var opt_off_r;
        
        var new_cost;
        var new_fitVal;
        var new_off_r; 
        
        var bestFitVal;
        
        // for all the primary routes 
	while(run)
	{
                //this helps us better deal with the scanning through the routes 
		var start_navigator_brk = [0].concat(optBreak);
		var end_navigator_brk = optBreak.concat(optRoute.length - 1);
		
		for (var fi = 0; fi < start_navigator_brk.length; fi++){
			//var tempRoute = optRoute;
                        var tempRoute = optRoute.slice();
                        //for all the secondary routes
			for (var fj = 0; fj < start_navigator_brk.length; fj++){
				//var tempBreak = optBreak;
                                var tempBreak = optBreak.slice();
                                //we do not compare a route against itself
				if (fj != fi){					
					for (var b = fi; b < optBreak.length; b++){
						tempBreak[b] = optBreak[b] - 1;
					}
					
					for (var b = fj; b < optBreak.length; b++){
						tempBreak[b] = tempBreak[b] + 1;
					}
					
                                        //sanity checks
					for (var y = 0; y < tempBreak.length; y++){
						if(tempBreak[y] < 1){
						    tempBreak[y] = 1;
						}
						if(tempBreak[y] > optRoute.length - 1){
						  tempBreak[y] = optRoute.length - 1;
						}
					}	
                                        
					var start_new_nav_brk = [0].concat(tempBreak);
					var end_new_nav_brk = tempBreak.concat(optRoute.length-1);
					
                                        //so far we have taken care of all the breaks 
                                        //do not remove more nodes from the primary route is already at minimum 
					if((end_navigator_brk[fi] - start_navigator_brk[fi]) > min_tour){
                                            //traverse through the primary route
						for (var fk = start_navigator_brk[fi]; fk <= end_navigator_brk[fi]; fk++){
							var allNewRoutes = new Array();
							var allNewFitVals = new Array();
							var row = 0;
                                                        //traverse through the new secondary route  
							for (var x = start_new_nav_brk[fj]; x <= end_new_nav_brk[fj]; x++){
                                                            //remove the node from the primary route
                                                                if (fk > -1) {
                                                                    tempRoute.splice(fk, 1);
                                                                }
                                                                //insert the node to the secondary route
								if (x > 0){
									newRoute = tempRoute.slice(0, x).concat(optRoute[fk]).concat(tempRoute.slice(x, tempRoute.length));
								}
								else{
									newRoute = optRoute.slice(fk,fk+1).concat(tempRoute.slice(x, tempRoute.length));
								}
                                                                newBreak = tempBreak.slice();
								//newBreak = tempBreak;
								 
                                                                 //console.log(newRoute);
                                                                //calculating the opt fitVal
//                                                                opt_cost = totalDistance(optRoute, optBreak);
//                                                                opt_off_r=off_routing_distance(optRoute,optBreak);
                                                                //opt_fitVal = opt_cost + (off_route_rate*opt_off_r);
                                                                opt_fitVal = fitVal(optRoute, optBreak, off_route_lim, off_route_rate)
								//calculating the opt fitVal
//                                                                new_cost = totalDistance(newRoute, newBreak);
//                                                                new_off_r=off_routing_distance(newRoute,newBreak);
//                                                                new_fitVal = new_cost + (off_route_rate*new_off_r);
                                                                new_fitVal = fitVal(newRoute, newBreak, off_route_lim, off_route_rate)
                                                                //allNewRoutes(row,:) = newRoute;
								if (new_fitVal<opt_fitVal){
                                                                        allNewRoutes.push(newRoute);								
									allNewFitVals.push(new_fitVal);
									row = row + 1;
								}
                                                                tempRoute = optRoute.slice();
								//tempRoute = optRoute;
							}
							//[bestFitVal,best_idx] = min(allNewFitVals);
                                                        bestFitVal = Math.min.apply(Math,allNewFitVals);
                                                        var best_idx = allNewFitVals.indexOf(bestFitVal);
                                                        
							if (bestFitVal < opt_fitVal){
                                                                //optRoute = allNewRoutes(best_idx,:);
                                                                optRoute = allNewRoutes[best_idx].slice();  
                                                                //console.log(optRoute);
								optBreak = newBreak.slice();
								tempRoute = optRoute.slice();
								post_fitVal = bestFitVal;
							}
						}
						
					}
				}				
			}
		}
        //if there was no improvment
	if(fitValHist == post_fitVal){
		run = 0;
	}
        else{
		fitValHist = post_fitVal;
	}
    }
}

/*
 * Return the demand of each path.
 */
function pathsCap(routes, brks)
{
	var paths = get_paths(routes, brks);
	var pathsL = paths.length;
	var pathsD = [];
	var weightSum;
	// Traverse paths
	for (var i = 0; i < pathsL; i++)
	{
		weightSum = 0;
		var paths_i_L = paths[i].length;
		// Traverse paths[i]
		for (var j = 0; j < paths_i_L; j++)
		{
			weightSum += stores[ paths[i][j] ].getDemand();
		}
		pathsD.push(weightSum);
	}
	
	return pathsD;
}

/*
 * Return the fitness value.
 * 
 * Fitness value is calculated like this:
 *		fitnessValue = temp_dist + totWeight
 *	where
 *		if tot_off_route is bigger than off_route_lim,
 *   		temp_dist = tot_dist + tot_off_route*off_route_rate,
 *   	or
 *   		temp_dist = tot_dist otherwise.
 *	and 
 *  	totWeight is the sum of the difference between the path's capacity 
 *  	and the truck capacity times the capacity_rate if the path capacity 
 *  	is bigger than the truck capacity and only if the capacity binary flag is on (checked), 
 *   	otherwise totWeight is 0.
 * 
 * Currently there is only one value for truck capacity
 */
function fitVal(routes, brks, off_route_lim, off_route_rate)
{
	var temp_dist;
	var w_temp = 0;
	var totWeight = 0;
	var fitVal = 0;
	var capacity_rate = 2000*off_route_rate;
	var tot_off_r = off_routing_distance(routes, brks);
	var tot_dist = totalDistance(routes, brks);
	
	if (is_capacity_on)
	{       
		var path_Capacity = pathsCap(routes, brks);
		var pathsCapL = path_Capacity.length;
		for (var i = 0; i < pathsCapL; i++)
		{
			var diff = path_Capacity[i] - truck_cap;
			
			if (diff <= 0)
				w_temp = 0;
			else
				w_temp = (diff/total_demand)*capacity_rate;
			
			totWeight += w_temp;
		}	
	}
	
	if (tot_off_r > off_route_lim)
		temp_dist = tot_dist + tot_off_r*off_route_rate;
	else
		temp_dist = tot_dist;
	
	fitVal = temp_dist + totWeight;
	
	return fitVal;
}

function group_progress(){
    
    var progbar = 0;
    var myprog = 0;
    document.getElementById("panel14").style.display = 'none';
    document.getElementById('panel12').appendChild(progress);
    popSize = document.getElementById('pop-size').value; 
    trucks = document.getElementById('no-trks').value;    
    off_route_rate = document.getElementById('off-rate').value;
    off_route_lim = document.getElementById('off-lim').value;
    var pBreaks = new Array(popSize);
    var pRoutes = new Array(popSize);
    var not_null_stores = non_null_indices(stores);
    var k = 0;
    var i = 0;
    var min_cost=10000000;
    var temp_dist;
    var off_r;
    var tot_dist;
    var min_brk;
    var min_route;
    if(is_capacity_on){
        truck_cap = document.getElementById('trk-cap').value;
    }
    else{
        truck_cap = undefined;
    }
    
    total_demand=0;
    for(x in not_null_stores){
        total_demand += stores[not_null_stores[x]].getDemand();
    }

    //randomly initialize the population
    updateProgress(progbar);
    while(k<popSize){
        pBreaks[k] = rand_breaks (trucks, non_null_size(stores), min_tour);
        pRoutes[k] = rand_routes (not_null_stores);
        
        k++;
    }
   var grouping =setInterval(function(){ 
             progbar = (myprog++/popSize)*100;
             updateProgress(progbar);

                off_r=off_routing_distance(pRoutes[i],pBreaks[i]);
                tot_dist=totalDistance(pRoutes[i],pBreaks[i]);
                if (off_r>off_route_lim)
                {
                    temp_fit= tot_dist + off_route_rate*(off_r);
                }
                else{
                    temp_fit= tot_dist;
                }
                insertion(pRoutes[i], pBreaks[i], temp_fit);        
                
                //off route
                pp_fit= fitVal(optRoute, optBreak, off_route_lim, off_route_rate);
                var pp_off_r = off_routing_distance(optRoute,optBreak);
                var pp_tot_dist = totalDistance(optRoute,optBreak);
                var pp_total_cost = pp_tot_dist + off_route_rate*(pp_off_r);
                
                if(pp_fit<min_cost){
                    min_cost=pp_fit;
                    min_route=optRoute.slice();
                    min_brk=optBreak.slice();
                    graph_groups(map, min_route, min_brk);
                    var x = "Total cost: " + pp_total_cost.toFixed(2) + " Total distance: " + pp_tot_dist.toFixed(2);
                    document.getElementById("panel").innerHTML = x;
                    }

                if (i== popSize-1){
                    clearInterval(grouping);
                    progbar = 100;
                    updateProgress(progbar);
                    graph_groups(map, min_route, min_brk);
                    optRoute=min_route.slice();
                    optBreak=min_brk.slice();
                    document.getElementById("panel14").style.display = 'block';
//                    var x = "Total cost: " + min_cost.toFixed(2) + " Total distance: " + totalDistance(min_route,min_brk).toFixed(2);
//                    document.getElementById("panel").innerHTML = x;
//                    document.getElementById("panel14").style.display = 'block';
                }
                i++;

    },0);
    
}
    
function reportWin(){
    
    var myWindow = window.open("","Scheduling Report", "_self");
    myWindow.document.write('<link rel="stylesheet" type="text/css" href="css/mystyle.css">');
    myWindow.document.write("<p><b>" + myWindow.name + "</b></p>");

    var r_off_r = off_routing_distance(optRoute,optBreak);
    var r_tot_dist = totalDistance(optRoute,optBreak);
    var r_total_cost = r_tot_dist + off_route_rate*(r_off_r);
    
    var myTable= "<table><tr>";
    myTable+="<td>number of trucks</td>";
    myTable+="<td>" + trucks + "</td></tr>";
    myTable+="<td>truck capacity</td>";
    myTable+="<td>" + truck_cap + "</td></tr>";
    myTable+="<td>off-routing rate</td>";
    myTable+="<td>$" + off_route_rate + " per km</td></tr>";
    myTable+="<td>off-routing limit</td>";
    myTable+="<td>" + off_route_lim + " km</td></tr>";
    myTable+="<td>DC latitude</td>";
    myTable+="<td>" + DC.getLat() + "</td></tr>";
    myTable+="<td>DC longitude</td>";
    myTable+="<td>" + DC.getLng() + "</td></tr>";
    myTable+="</table>";
        
    var paths = get_paths(optRoute, optBreak);
    var route_demands = pathsCap(optRoute, optBreak);
	// save paths.length
    var trk_num;
    var myTable2= "<table><tr>";
    myTable2+= "<tr><th>Truck Number</th><th>Route Layout</th><th>Route Demand</th><th>Route Distance</th><th>Feasible</th></tr>";
    for (var i=0; i<paths.length; i++){
        trk_num = i+1;
        myTable2+="<td>Truck " + trk_num  + "</td>";
        
        myTable2+="<td><font color=blue> DC </font>";
        for(x in paths[i]){
            myTable2+= " -- " + "<font color=blue>" + stores[paths[i][x]].getExt() +"</font>";
        }
        myTable2+="<td>" + route_demands[i].toFixed(2) + "</td>";
        myTable2+="<td> route distance </td>";
        if(route_demands[i]>truck_cap){
            myTable2+="<td><font color=red><b> No </b></font></td>";
        }
        else{
            myTable2+="<td><font color=green><b> Yes </b></font></td>";
        }
        myTable2+= "</td></tr>";
        
    }
    myTable2+="</table>";

    
    var myTable3= "<table><tr>";
    myTable3+="<td><b>total demand</b></td>";
    myTable3+="<td><b>" + total_demand.toFixed(2)  + "</b></td></tr>";
    myTable3+="<td><b>total off-routing</b></td>";
    myTable3+="<td><b>" + r_off_r.toFixed(2) + " km</b></td></tr>";
    myTable3+="<td><b>total distance</b></td>";
    myTable3+="<td><b>" + r_tot_dist.toFixed(2) + " km</b></td></tr>";
    myTable3+="<td><b>fitness value</b></td>";
    myTable3+="<td><b>" + fitVal(optRoute, optBreak, off_route_lim, off_route_rate).toFixed(2) + "</b></td></tr>";
    myTable3+="<td><b>total cost</b></td>";
    myTable3+="<td>$<b>" +  r_total_cost.toFixed(2) + "</b></td></tr>";
    myTable3+="</table>";
    
    myWindow.document.write("<p><b>Results:</b></p>" );
    myWindow.document.write(myTable3);
    myWindow.document.write("<p><b>Parameters:</b></p>" );
    myWindow.document.write(myTable);
    myWindow.document.write("<p><b>Routes:</b></p>" );
    myWindow.document.write(myTable2);

    
};


