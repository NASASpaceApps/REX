
// NASA Space Challenge
// April 19, 2013
// Toronto, ROM
// Hamid Tizhoosh, Univesity of Waterloo
// Ported from Matlab to JS by Matus Faro and Victor Vucicevich


//The current max possible error
var maxError = 100000000;

//Maximum number of iterations. Higher means more accuracy.
//Initially done in matlab at 500 iterations, but we've kicked it up a notch.
var maxIter = 5000;

//The acceptable error rate
var errorTolerance  = 0.1;

//Initialializing vector arrays
var A=[0,0];
var bestA=[0];

//The error of the iteration. Replaces maxError.
var thisError = 0;


//Just generates some fake data to test with.
function fakedata(){

	//10 years, 52 weeks per year
	var arr = Array(10);
	for(var x = 0;x<10;x++){
		arr[x] = Array(52);
		for(var y = 0;y<52;y++){
			arr[x][y] = Math.random()*5;
		}
	}	

	 //Need to rotate the incoming data from week data in a year to yearly week data.
	 var rotaded = rotateData(arr);
	 //Now we do some genetic algorithms yes.
	 var result = PredictFuture(rotaded);
	 console.log(result);
}

//This is where we organize and use all the data we have for solar at the coordinates entered
function processData(data) {
	//keeping track of where we are in in the data
	var prevWeek = 1;
	var w=0;
	var y=0;
	var organizedData = [];
	for(var i = 0; i < data.length; i++){
		if (prevWeek != data[i].week){
			prevWeek=data[i].week;
			w++;
			y=0;
		}
		organizedData.push([]);
		//Organizing the data by weeks
		organizedData[w][y] = data[i].unit;
		y++;
	}
	//Getting the average units per yer.
	//Defining like this to avoid pushing. 
	var avgs=[0,0,0,0,0,0,0,0,0,0,0];
	for (var m = 0; m < 51; m++){
		for (var n = 0; n < organizedData[m].length; n++){
			avgs[n]+=organizedData[m][n]
		}
	}
	console.log(avgs);
	//So now we predict for the future.. and get their yearly averages.
	var futureData = PredictFuture(organizedData);
	for(var j=0; j < 51; j++) {
		for(var k =0; k < futureData[j].length-1; k++) {
			avgs[k+8]+=futureData[j][k+1];
		}
	}
	//Make them into averages
	for(var p = 0;p<avgs.length;p++){
		avgs[p] /= 52;
	}

	//shaboom
	return(avgs);


}

//Only used when the data given isn't in the proper order for PredictFuture
function rotateData(SolarData) {

	//Quick and dirty rotation. Actually not a rotation. shhhh.
	var height10 = SolarData.length;
	console.log(height10);
	var width52 = SolarData[0].length;
	console.log(width52);
	var newData = [];
	for(var x =0; x<width52 ;x++){
		newData.push([]);
		for(var y=0; y<height10; y++){
			newData[x].push([]);
			newData[x][y] = SolarData[y][x];
		}
	}
	return newData;
}

//This is where things start getting confusing. yay!

//This function estimates the parameters of a 
//function that represents the numbers in values.

//Essentially, we KNOW 10 datapoints. So we look at the first 9 and guess
//over and over again at what the 10th value is. Once we have a reasonably low
//error on that, we move forward on estimating what the 11th datapoint would be.
function estimateFuncParam(row) {

//Working with one row at a time
	var size = row.length;
	//current number of iterations;
	var numIter=0;

//Start the estimation loop
	while (maxError > errorTolerance) {
		//one more iteration
		numIter++;
		//Stop of max number of iterations is already reached
		if(numIter > maxIter){
			//Breaking in javascript?
			break;
		}
		//Sum and Opposite sum
		var Sum = 0;
		var OSum = 0;

		//Make a guess
		for (var j=1; j < size; j++) {
			A[j] = Math.random();
			Sum=Sum + A[j] + row[j];
		}
		//Look at the opposite guess
		var OA = [0,0];
		for (var k=1; k<row.length; k++) {
			OA[k] = 1- A[k]
		}
		for (var l=1; l<row.length-1; l++) {
			OSum=OSum+OA[l]+row[l];
		}
		//Check which one is the better estimate.
		if ( Math.abs(Sum - row[size-1]) < Math.abs(OSum - row[size-1]) ) {
			thisError = Math.abs(Sum - row[size-1]);
			bestA = A;
   		}else{
   			thisError = Math.abs(OSum - row[size-1]);

        	bestA = OA;
		}

		//Then, update the new error bound
		if (thisError<maxError) {
        	maxError = thisError;
		}
		//Now do that a ton of times until we know how we got the LAST number in that row array.
	}

	//So give back some answers and the error we have this to.
	return [bestA, maxError];
}



function PredictFuture(SunData){
	// This function takes a matrix SunData as input with 10 columns and some 52
	// rows. Each column represents one year. The values are average weekly
	// irradiance values (W/m^2).
	// The function predicts the next three years and returns a matrix with 3
	// columns and 52 rows.
	// how much data?
	var numWeeks = SunData.length
	var numYears = SunData[0].length;
	
	// initialize return matrix
	var SunDataFuture = Array(numWeeks);
	for(var x = 0; x < numWeeks; x++){
		SunDataFuture[x] = Array(3);
	}
		
	// start the prediction tool
	for(var i = 0; i <numWeeks; i++){
		// get one row of data: the same week for many years
		var a = SunData.slice();
		a=a[i];
		// based on that row estimate the parameters (function is above)
		var returnValue = estimateFuncParam(a);
		var bigA = returnValue[0];
		var maxError = returnValue[1];
		// can we say the error is low?
		var isErrorLow = 1 - ((maxError < 1)?maxError:1);
		// Predict the next year
		SunDataFuture[i][1] = (1 - isErrorLow) * mean(a) + isErrorLow * sum(vectorMultiplication(A,a,a.length-1));
		// Predict the second year
		var b = Array(a.length);
		for(var x = 0; x < b.length - 1; x++){
			b[x] = a[x+1];
		}
		b[a.length-1] = SunDataFuture[i][1];
		SunDataFuture[i][2] = (1 - isErrorLow) * mean(b) + isErrorLow * sum(vectorMultiplication(A,a,a.length-1));

		// Predict the third year
		for(var x = 0; x < b.length - 2; x++){
			b[x] = a[x+2];
		}
		b[a.length-2] = SunDataFuture[i][1];
		b[a.length-1] = SunDataFuture[i][2];

		SunDataFuture[i][3] = (1 - isErrorLow) * mean(b) + isErrorLow * sum(vectorMultiplication(A,a,a.length-1));

	}
	//And there it is!
	return SunDataFuture;
}

//Just a mean function. 
function mean(data){
	var mean = 0;
	for(var x = 0; x < data.length; x++){
		mean += data[x] / data.length;
	}
	return mean;
}

//Summation.
function sum(data){
	var sum = 0;
	for(var x = 0; x < data.length; x++){
		sum += data[x];
	}
	return sum;
}

//Multiplying vectors.
function vectorMultiplication(vectorOne,vectorTwo,vectorSize){
	if(!vectorSize)vectorSize = vectorOne.length;
	var out = 0;
	for(var x = 0; x < vectorSize; x++){
		out += vectorOne[x] * vectorTwo[x];
	}
	return out;
}

//Expanding an array. Just to be safe.
function resizeArray(array, rows, cols){
	array.length = rows;
	for(var x = 0; x < array.length; x++){
		array[x].length = cols;
	}
	return array;
}


