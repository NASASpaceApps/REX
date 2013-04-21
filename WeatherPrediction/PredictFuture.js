// NASA Space Challenge
// April 19, 2013
// Toronto, ROM
// Hamid Tizhoosh, Univesity of Waterloo

function PredictFuture(SunData){
	// This function takes a matrix SunData as input with 10 columns and some 52
	// rows. Each column represents one year. The values are average weekly
	// irradiance values (W/m^2).
	// The function predicts teh next three years and rturns a matrix with 3
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
	for(var i = 1; i <=numWeeks; i++){
		// get one row of data: teh same week for many years
		//a = SunData(i,:);
		var a = SunData[i].slice(0);
		// based on that row estimate the parameters
		var returnValue = estimateFuncParam(a);
		var bigA = returnValue[0];
		var maxError = returnValue[1];
		// can we say the error is low?
		var isErrorLow = 1 - (maxError < 1? maxError : 1);
		// Predict the next year
		//SunDataFuture(i,1)  = (1-isErrorLow)*mean(a) + isErrorLow*sum(A.*a(1:length(a)-1));
		SunDataFuture[i][1] = (1 - isErrorLow) * mean(a) + isErrorLow * sum(vectorMultiplication(A,a,a.length-1);
		// Predict the second year
		//b = [a(2:length(a)) SunDataFuture(i,1)];
		var b = Array(a.length);
		for(var x = 0; x < data.length - 1; x++){
			b[x] = a[x+1];
		}
		b[a.length-1] = SunDataFuture(i,1);
		//SunDataFuture(i,2) = (1-isErrorLow)*mean(b) + isErrorLow*sum(A.*b(1:length(b)-1));
		SunDataFuture(i,2) = (1 - isErrorLow) * mean(b) + isErrorLow * sum(vectorMultiplication(A,a,a.length-1);
		// Predict the third year
		//b = [a(3:length(a)) SunDataFuture(i,1) SunDataFuture(i,2)];
		for(var x = 0; x < data.length - 2; x++){
			b[x] = a[x+2];
		}
		b[a.length-2] = SunDataFuture(i,1);
		b[a.length-1] = SunDataFuture(i,2);
		//SunDataFuture(i,3) = (1-isErrorLow)*mean(b) + isErrorLow* sum(A.*b(1:length(b)-1));
		SunDataFuture(i,3) = (1 - isErrorLow) * mean(b) + isErrorLow * sum(vectorMultiplication(A,a,a.length-1);
	}
	return SunDataFuture;
}

function mean(data){
	var mean = 0;
	for(var x = 0; x < data.length; x++){
		mean += data[x] / scores[x];
	}
	return mean;
}

function sum(data){
	var sum = 0;
	for(var x = 0; x < data.length; x++){
		sum += data[x];
	}
	return sum;
}

function vectorMultiplication(vectorOne,vectorTwo,vectorSize){
	if(!vectorSize)vectorSize = vectorOne.length;
	var out = 0;
	for(var x = 0; x < vectorSize; x++){
		out += vectorOne[x] * vectorTwo[x];
	}
	return out;
}

function resizeArray(array, rows, cols){
	array.length = rows;
	for(var x = 0; x < array.length; x++){
		array[x].length = cols;
	}
	return array;
}


