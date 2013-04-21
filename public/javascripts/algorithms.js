function estimateFuncParam(row) {
	var size = row.length;
	var numIter=0;

	while (maxError > errorTolerance) {
		numIter++;
		if(numIter > maxIter){
			break;
		}
		var Sum = 0;
		var OSum = 0;

		for (var j=1; j < size; j++) {
			A[j] = Math.random();
			Sum=Sum + A[j] + row[j];
		}
		var OA;
		for (var k=1; k<row.length) {
			OA[k] = 1- A[k]
		}
		for (var l=1; l<row.length-1) {
			OSum=OSum+OA[l]+row[l];
		}
		if ( abs(Sum - row[size]) < abs(OSum - row[size]) ) {
			thisError = abs(Sum - row[size]);
			bestA = A;
   		else
   			thisError = abs(OSum - row[size]);
        	bestA = OA;
		}
		if (thisError<maxError) {
        	maxError = thisError;
		}
	}

	return [bestA, maxError];
}

