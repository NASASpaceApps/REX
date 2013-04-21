	var maxError = 100000000;
	var maxIter = 5000;
	var errorTolerance  = 0.1;
	var A=[0,0];
	var bestA=[0];
	var thisError = 0;

console.log("fsfs")
function fakedata(){
	 var fake=[1,2,3,4,5,6,7,6,5,4,3,2,1];
	 var result = estimateFuncParam(fake);
	 console.log(result);
}

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
		var OA = [0,0];
		for (var k=1; k<row.length; k++) {
			OA[k] = 1- A[k]
		}
		for (var l=1; l<row.length-1; l++) {
			OSum=OSum+OA[l]+row[l];
		}
		if ( Math.abs(Sum - row[size-1]) < Math.abs(OSum - row[size-1]) ) {
			thisError = Math.abs(Sum - row[size-1]);
			bestA = A;
   		}else{
   			thisError = Math.abs(OSum - row[size-1]);

        	bestA = OA;
		}
		if (thisError<maxError) {
        	maxError = thisError;
		}
	}

	return [bestA, maxError];
}

