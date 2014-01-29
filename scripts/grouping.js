function updateDistMatrix(stores)
{
	/* update global variable distMat */
	distMat = distanceMatrix(stores);
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
					var dist = distance(stores[i], stores[j]);					
					distMat[i][j] = dist;
					distMat[j][i] = dist;
					
					/* check */
					console.log("dist[" + i + "][" + j + "] = " + distMat[i][j]);
					console.log("dist[" + j + "][" + i + "] = " + distMat[j][i]);
					
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