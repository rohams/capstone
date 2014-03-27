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
 * Example: routes = [DC1, 2, 4, DC2 6, 5, DC1 3, 1, 7], and brks would be = [2, 5],
 * the output, paths = [ [DC, 2, 4], [DC2, 6, 5], [DC1, 3, 1, 7] ]. Note that it is a 2D array.
 * Each path is for one truck.
 */
function get_paths(routes, brks)
{
	
	// save brks.length
	var brksLength = brks.length;
	//console.log("brksLength = " + brksLength);
	var paths = new Array(brksLength + 1);
	
	if (brksLength == 0) // Meaning there's only one route
	{
		// Have to use concat method. 
		// Assignment operator will assign the reference of the array, not copy it.
		paths[0] = new Array();
		paths[0] = paths[0].concat(routes); 
	} else {
		paths[0] = new Array();
		paths[0] = paths[0].concat(routes.slice(0, brks[0] + 1)); // Take the first path
		for (var i = 1; i < brksLength; i++)
		{
			paths[i] = new Array();
			paths[i] = paths[i].concat(routes.slice(brks[i-1]+1, brks[i]+1));
		}
		paths[brksLength] = new Array();
		paths[brksLength] = paths[brksLength].concat(routes.slice(brks[brksLength-1] + 1)); // last path
	}
	
//	// Test: Check output------------
//	for (var i = 0; i < paths.length; i++)
//	{
//		console.log("paths[" + i + "] = " + paths[i]);
//	}
//	// ------------------------------
//	
	return paths;
}

/*
 * Returns an array that contains the distance traveled by each path
 * in the given routes.
 */
function route_distance(routes, brks){
	
	var paths = get_paths(routes, brks);
	// save paths.length
	var pathsLength = paths.length;
	
	// distances will store the distances that need to be traveled in each paths
	var pathsDist = new Array(pathsLength);
	
	// Get the distance from the starting point (a DC) to the first store
	for (var i = 0; i < pathsLength; i++)
	{		
		pathsDist[i] = new Array();
		pathsDist[i].push(distHaversine(paths[i][0], stores[paths[i][1]]));
		// Test: check output
		//console.log("pathsDist[" + i + "] = " + pathsDist[i]);
	}
	
	// using the global variable distMat
	distMat = distanceMatrix(stores);
	
	for (var i = 0; i < pathsLength; i++) // traverse paths
	{
		var path_iLength = paths[i].length;
		for (var j = 1; j < path_iLength - 1; j++) // traverse paths[i]
		{
			// Test: check output -----------
			// Show all the distances involve to check if it's correct
			 //console.log("Dist[" + paths[i][j] + "][" + paths[i][j+1] + "] = " + distMat[paths[i][j]][paths[i][j+1]]);
			// ------------------------------
			pathsDist[i].push(distMat[paths[i][j]][paths[i][j+1]]);
		}
	}
	
	// Test: check pathsDist --
	//console.log("pathsDist = " + pathsDist);	
	// ------------------------
	
	// eachPathTotDist will store the total distance of each path (ie each truck's total distance)
	var eachPathTotDist = new Array(pathsLength);
	for (var i = 0; i < pathsLength; i++)
	{
		var sum = new Number(0);
		var pathsDist_iL = pathsDist[i].length;
		for (var j = 0; j < pathsDist_iL; j++)
		{
			sum += Number(pathsDist[i][j]);
		}
		eachPathTotDist[i] = sum;
		// Test: check sum
		//console.log("sum" + i + " " + sum);
	}
	
	// Test: check pathsDistances --
	//console.log("eachPathTotDist = " + eachPathTotDist);
	// -----------------------------
	
	return eachPathTotDist;
}

/* 
 * Calculates the off routing distance of the given routes.
 * Formula: totalRouteDistance - sumOfDirectDistanceFromDCToLastStoreOfEachPath 
 * */
function off_routing_distance(routes, brks)
{
	
	var totalDist = totalDistance(routes, brks);
	
	// Test: totalDist ---
	//console.log("totalDist = " + totalDist);
	// -------------------
	
	var paths = get_paths(routes, brks);
	var pathsLength = paths.length;
	
	var sumOfDirectDistance = 0;
	// DirectDistance is the distance from the starting point (a DC) to the last store
	for (var i = 0; i < pathsLength; i++)
	{
		var temp = Number(distHaversine(paths[i][0], stores[paths[i][ paths[i].length - 1 ]]));
		// Test: check distHaversine output ---
		//console.log("distHaversine" + i + " = " + temp);
		// ------------------------------------
		sumOfDirectDistance += temp;
	}
	
	// Test: check sumOfDirectDistance --
	//console.log("sumOfDirectDistance = " + sumOfDirectDistance);
	// ----------------------------------
	
	var offRouteDist = totalDist - sumOfDirectDistance;
	
	// Test: check offRouteDist --
	//console.log("offRouteDist = " + offRouteDist);
	// ---------------------------
	
	return offRouteDist;
}

/* 	
 * Calculates the total distance of the routes solution.
 * Uses the function route_distance()
*/
function totalDistance(routes, brks)
{	
	var pathsDistances = route_distance(routes, brks);
	var pathsDistancesL = pathsDistances.length;
	var totSum = 0;
	
	for (var i = 0; i < pathsDistancesL; i++)
	{
		totSum += pathsDistances[i];
	}
	
	return totSum;
}

/*	
 * Draws the paths based on the given routes and brks.
 * The content of brks must be in increasing order 
 * as it should be otherwise the function will break.
 */
function graph_groups(map, routes, brks)
{

	
	 if (drawPath!= undefined){
         drawPath.setMap(null);
     }
	 
	var pathsIndex = get_paths(routes, brks);
	//console.log("pathsIndex = " + pathsIndex);
	var pathsIndexL = pathsIndex.length;
	var pathsStores = new Array(pathsIndexL);
	
	for (var i = 0; i < pathsIndexL; i++)
	{
		var pathsIndex_iL = pathsIndex[i].length;
		pathsStores[i] = new Array();
		// Add the DC
		//console.log("pathsIndex[" + i +"][0] = " + pathsIndex[i][0].getLat() + ", " + pathsIndex[i][0].getLng() );
		pathsStores[i].push( new google.maps.LatLng( pathsIndex[i][0].getLat(), pathsIndex[i][0].getLng() ));
		for (var j = 1; j < pathsIndex_iL; j++)
		{
			pathsStores[i].push( new google.maps.LatLng( stores[pathsIndex[i][j]].getLat(), stores[pathsIndex[i][j]].getLng() ));
		}
	}
	
	// Paths color
	var colorCode = ['#000000', '#336699', '#339933', '#660066', '#9966FF', '#663300', '#660066', '#A366A3', '#800000', 
	                 '#808000', '#008000', '#800080', '#008080', '#0000880', '#FF4500'];
	
	var colorCodeL = colorCode.length;
	
    if (oldPath){
        for (x in oldPath)
        oldPath[x].setMap(null);
    }
    oldPath = [];
    
    for (var i = 0; i < pathsIndexL; i++)
    {
    	var drawPath = new google.maps.Polyline({
    		path: pathsStores[i],
    		geodesic: true,
    		strokeColor: colorCode[i % colorCodeL],
    		strokeOpacity: 1.0,
    		strokeWeight:2
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

/* 
 * Shuffle the rand_arr based on Fisher-Yates Shuffle Modern Algorithm 
 * The output is the shuffled array.
 * */
function rand_routes(myArr)
{
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

        var opt_fitVal;
        var new_fitVal;

        
        var bestFitVal;
        
        // for all the primary routes 
	while(run)
	{
                //this helps us better deal with scanning through the routes
                var incOptBrk=optBreak.slice();
                for (var x1 in incOptBrk){
                    incOptBrk[x1]+=1;
                }
		var start_navigator_brk = [0].concat(incOptBrk);
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
                                        var incOptBrk=tempBreak.slice();
                                        for (var x2 in incOptBrk){
                                            incOptBrk[x2]+=1;
                                        }
					var start_new_nav_brk = [0].concat(incOptBrk);
					var end_new_nav_brk = tempBreak.concat(optRoute.length-1);
					
                                        //so far we have taken care of all the breaks 
                                        //do not remove more nodes from the primary route is already at minimum 
					if((end_navigator_brk[fi] - (start_navigator_brk[fi]+1)) > (min_tour)){
                                            //traverse through the primary route
						for (var fk = start_navigator_brk[fi]+1; fk <= end_navigator_brk[fi]; fk++){
							var allNewRoutes = new Array();
							var allNewFitVals = new Array();
							var row = 0;
                                                        //traverse through the new secondary route  
							for (var x = start_new_nav_brk[fj]+1; x <= end_new_nav_brk[fj]; x++){
                                                            if((end_navigator_brk[fi] - (start_navigator_brk[fi]+1)) > (min_tour)){
                                                            //remove the node from the primary route
                                                                if (fk > 0) {
                                                                    tempRoute.splice(fk, 1);
                                                                }
                                                                //insert the node to the secondary route
								if (x > 0){
									newRoute = tempRoute.slice(0, x).concat(optRoute[fk]).concat(tempRoute.slice(x, tempRoute.length));
								}
//                                                                console.log("end_navigator_brk = " + end_navigator_brk);
//                                                                console.log("start_navigator_brk = " + start_navigator_brk);
//                                                                console.log("fi = " + fi);                                                                
//                                                                console.log("fk = " + fk);
//                                                                console.log("x = " + x);
//                                                                console.log("Route = " + Route);
//                                                                console.log("newBreak = " + tempBreak);
//                                                                console.log("newRoute = " + newRoute);
                                                                newBreak = tempBreak.slice();
                                                                //calculating the opt fitVal
                                                                opt_fitVal = fitVal(optRoute, optBreak, off_route_lim, off_route_rate);
								//calculating the opt fitVal
                                                                new_fitVal = fitVal(newRoute, newBreak, off_route_lim, off_route_rate);
                                                                //allNewRoutes(row,:) = newRoute;
								if (new_fitVal<opt_fitVal){
                                                                        allNewRoutes.push(newRoute);								
									allNewFitVals.push(new_fitVal);
									row = row + 1;
								}
                                                                tempRoute = optRoute.slice();
								//tempRoute = optRoute;
                                                            }
							}
							//[bestFitVal,best_idx] = min(allNewFitVals);
                                                        bestFitVal = Math.min.apply(Math,allNewFitVals);
                                                        var best_idx = allNewFitVals.indexOf(bestFitVal);
                                                        
							if (bestFitVal < opt_fitVal){
                                                                //optRoute = allNewRoutes(best_idx,:);
                                                                optRoute = allNewRoutes[best_idx].slice(); 
                                                                console.log("optRoute = " + optRoute);
                                                                //console.log(optRoute);
								optBreak = newBreak.slice();
								tempRoute = optRoute.slice();
								post_fitVal = bestFitVal;
                                                                //update nav_breaks
                                                                incOptBrk=optBreak.slice();
                                                                for (var x1 in incOptBrk){
                                                                    incOptBrk[x1]+=1;
                                                                }
                                                                start_navigator_brk = [0].concat(incOptBrk);
                                                                end_navigator_brk = optBreak.concat(optRoute.length - 1);
                                                                tempBreak = optBreak.slice();
                                                                for (var b = fi; b < optBreak.length; b++){
                                                                    tempBreak[b] = optBreak[b] - 1;
                                                                }
					
                                                                for (var b = fj; b < optBreak.length; b++){
                                                                    tempBreak[b] = tempBreak[b] + 1;
                                                                }
                                                                var incOptBrk=tempBreak.slice();
                                                                for (var x3 in incOptBrk){
                                                                    incOptBrk[x3]+=1;
                                                                }
                                                                start_new_nav_brk = [0].concat(incOptBrk);
                                                                end_new_nav_brk = tempBreak.concat(optRoute.length-1);	
                                                                fk = start_navigator_brk[fi]+1;
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
 * Return the demand of each path in an array.
 */
function pathsCap(routes, brks)
{
	// Test: Data (All are BC North stores) -----------
	//var DC1 = new Node(parseFloat(53.04121304075649), parseFloat(-124.716796875));
	//var DC2 = new Node(parseFloat(53.12040528310657), parseFloat(-117.24609375));
	//var routes = [DC1, 21, 22, DC2, 25, 28, DC1, 29, 31, 37, DC2, 38, 55, 56, 57, DC2, 66, 71, 81, 84, DC1, 109];
	//var brks = [2, 5, 9, 14, 19];
	// ------------------------------------------------
	
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
		for (var j = 1; j < paths_i_L; j++)
		{
			weightSum += stores[ paths[i][j] ].getDemand();
		}
		pathsD.push(weightSum);
	}
	
	// Test: pathsD ---
	//console.log("pathsD = " + pathsD);
	// ----------------
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
    //document.getElementById("panel16").style.display = 'none';
    document.getElementById('panel12').appendChild(progress);
    popSize = parseFloat(document.getElementById('pop-size').value); 
    trucks = parseFloat(document.getElementById('no-trks').value);   
    off_route_rate = parseFloat(document.getElementById('off-rate').value);
    off_route_lim = parseFloat(document.getElementById('off-lim').value);
    if (off_route_lim < 0 || isNaN(off_route_lim) || off_route_rate < 0 || isNaN(off_route_rate) || trucks < 0 || isNaN(trucks) || 
    		popSize < 0 || isNaN(popSize) ) {
    	alert("Entered store grouping parameter is not valid!");
    	return;
    }
    var pBreaks = new Array(popSize);
    var pRoutes = new Array(popSize);
    var not_null_stores = non_null_indices(stores);
    var k = 0;
    var i = 0;
    var min_cost=10000000;
    var temp_dist;
    var off_r;
    var tot_dist;
    hist = [];
    var min_brk;
    var min_route;
    // for 2 DC initialization
    if (DC2!=null){
        popSize = popSize*(trucks+1);
    }
    if(is_capacity_on){
        truck_cap = document.getElementById('trk-cap').value;
        if (truck_cap < 0 || isNaN(truck_cap) ) {
        	alert("Entered truck capacity value is not valid!");
        	return;
        }
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
            // for 2 DC initialization
        if (DC2!=null){

            for (var j=0; j<(trucks+1) ;j++){
                var assign_DC=j;
                pRoutes[k]=[];
                var temp_route = rand_routes (not_null_stores);
                pBreaks[k] = rand_breaks (trucks, non_null_size(stores), min_tour);
                var nav_brk = [-1].concat(pBreaks[k]).concat(temp_route.length-1);
                //insert DCs at the start of each route
                for(var x=0; x<(nav_brk.length)-1;x++){
                    if(assign_DC<1){ pRoutes[k].push(DC);}
                    else {pRoutes[k].push(DC2);}
                    assign_DC--;
                    pRoutes[k] = pRoutes[k].concat(temp_route.slice(nav_brk[x]+1,nav_brk[x+1]+1));
                }
                //update the break array
                for(var ii=0; ii<pBreaks[k].length; ii++){
                    pBreaks[k][ii]+=ii+1;
                }

                k++;
            }
        }
        // for 2 DC initialization
        else{
            pBreaks[k] = rand_breaks (trucks, non_null_size(stores), min_tour);
            pRoutes[k]=[];
            var temp_route = rand_routes (not_null_stores);
            var nav_brk = [-1].concat(pBreaks[k]).concat(temp_route.length-1);
            //insert DCs at the start of each route
            for(var x=0; x<(nav_brk.length)-1;x++){
                pRoutes[k].push(DC);
                pRoutes[k] = pRoutes[k].concat(temp_route.slice(nav_brk[x]+1,nav_brk[x+1]+1));
            }
            //update the break array
            for(var ii=0; ii<pBreaks[k].length; ii++){
                pBreaks[k][ii]+=ii+1;
            }
            k++;        
        }
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
                hist.push(min_cost);
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
                    //document.getElementById("panel16").style.display = 'block';
                }
                i++;

    },0);
    
}    

function reportWin(){
   
    var myWindow = window.open("","Scheduling Report", "_self");
    myWindow.document.write('<link rel="stylesheet" type="text/css" href="css/mystyle.css">');
    myWindow.document.write("<p><b>" + myWindow.name + "</b></p>");
    drawChart();  
    var r_off_r = off_routing_distance(optRoute,optBreak);
    var r_tot_dist = totalDistance(optRoute,optBreak);
    var r_total_cost = r_tot_dist + off_route_rate*(r_off_r);
    
    var myTable= "<table><tr>";
    myTable+="<td>number of trucks</td>";
    myTable+="<td>" + trucks + "</td></tr>";
    myTable+="<td>truck capacity</td>";
    if(truck_cap!=undefined){
        myTable+="<td>" + truck_cap + "</td></tr>";
    }
    else{
        myTable+="<td><font color=red>" + truck_cap + "</font></td></tr>";
    }
    myTable+="<td>off-routing rate</td>";
    myTable+="<td>$" + off_route_rate + " per km</td></tr>";
    myTable+="<td>off-routing limit</td>";
    myTable+="<td>" + off_route_lim + " km</td></tr>";
    myTable+="<td>DC1 latitude</td>";
    myTable+="<td>" + DC.getLat() + "</td></tr>";
    myTable+="<td>DC1 longitude</td>";
    myTable+="<td>" + DC.getLng() + "</td></tr>";
    if (DC2!=null){
        myTable+="<td>DC2 latitude</td>";
        myTable+="<td>" + DC2.getLat() + "</td></tr>";
        myTable+="<td>DC2 longitude</td>";
        myTable+="<td>" + DC2.getLng() + "</td></tr>";
    }
    myTable+="</table>";
        
    var paths = get_paths(optRoute, optBreak);
    var route_demands = pathsCap(optRoute, optBreak);
    var rte_dist = route_distance(optRoute, optBreak);
	// save paths.length
    var trk_num;
    var myTable2= "<table><tr>";
    myTable2+= "<tr><th>Truck Number</th><th>Route Layout</th><th>Route Demand</th><th>Route Distance</th><th>Feasible</th></tr>";
    for (var i=0; i<paths.length; i++){
        trk_num = i+1;
        myTable2+="<td>Truck " + trk_num  + "</td>";
        
        for(var x in paths[i]){
            if (x==0){
                if(paths[i][x]==DC){
                    myTable2+= "<td><font color=blue> DC1 </font>";
                }
                else{
                    myTable2+= "<td><font color=blue> DC2 </font>";
                }
                
            }
            else{
                myTable2+= " -- " + "<font color=blue>" + stores[paths[i][x]].getExt() +"</font>";
            }
        }
        myTable2+="<td>" + route_demands[i].toFixed(2) + "</td>";
        myTable2+="<td>" + rte_dist[i].toFixed(2) + "</td>";
        if(route_demands[i]>truck_cap){
            myTable2+="<td><font color=red><b> No </b></font></td>";
        }
        else{
            myTable2+="<td><font color=green><b> Yes </b></font></td>";
        }
        myTable2+= "</td></tr>";
        
    }
    myTable2+="</table>";

    var chart = window.document.getElementById('chart_div');
    var myTable3= "<table><tr>";
    myTable3+="<td>total demand</td>";
    myTable3+="<td>" + total_demand.toFixed(2)  + "</td></tr>";
    myTable3+="<td>total off-routing</td>";
    myTable3+="<td>" + r_off_r.toFixed(2) + " km</td></tr>";
    myTable3+="<td>total distance</td>";
    myTable3+="<td>" + r_tot_dist.toFixed(2) + " km</td></tr>";
    myTable3+="<td>fitness value</td>";
    myTable3+="<td>" + fitVal(optRoute, optBreak, off_route_lim, off_route_rate).toFixed(2) + "</td></tr>";
    myTable3+="<td><b>total cost</b></td>";
    myTable3+="<td>$<b>" +  r_total_cost.toFixed(2) + "</b></td></tr>";
    myTable3+="</table>";
    
    myWindow.document.write("<p><b>Results:</b></p>" );
    myWindow.document.write(myTable3);
    myWindow.document.write("<p><b>Parameters:</b></p>" );
    myWindow.document.write(myTable);
    myWindow.document.write("<p><b>Routes:</b></p>" );
    myWindow.document.write(myTable2); 
    myWindow.document.write("<p><b>History of best solution:</b></p>" );
    myWindow.document.write(chart.innerHTML);
};


function drawChart() {
	 
    var history = [];
    var trial = 1;
//    history.push(['Trial', 'Fitness Value']);

        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Trial');
        data.addColumn('number', 'Fitness Value');
        data.addRows(hist.length);
        for (var i=0; i<hist.length; i++){
          data.setCell(i,0,trial.toString());
          data.setCell(i,1,hist[i]);
           trial++;
       }
        var options = {
          legend:'none',
          axisTitlesPosition:'in',
          pointSize:1,
          vAxis: {title: 'Best fitness value'}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

