% NASA Space Challenge
% April 19, 2013
% Toronto, ROM
% Hamid Tizhoosh, Univesity of Waterloo

function SunDataFuture = PredictFuture(SunData)
% This function takes a matrix SunData as input with 10 columns and some 52
% rows. Each column represents one year. The values are average weekly
% irradiance values (W/m^2).
% The function predicts teh next three years and rturns a matrix with 3
% columns and 52 rows.

% how much data?
[numWeeks numYears] = size(SunData);

% start the prediction tool
h = waitbar(0,'Predicting irradiance for the next 3 years...');
for i=1:numWeeks
    % get one row of data: teh same week for many years
    a = SunData(i,:);
    % based on that row estimate the parameters
    [A,maxError] = estimateFuncParam(a);
    % can we say the error is low?
    isErrorLow = 1- min(1,maxError);
    % Predict the nest year
    SunDataFuture(i,1)  = (1-isErrorLow)*mean(a) + isErrorLow*sum(A.*a(1:length(a)-1));
    % Predict the second year
    b = [a(2:length(a)) SunDataFuture(i,1)];
    SunDataFuture(i,2) = (1-isErrorLow)*mean(b) + isErrorLow*sum(A.*b(1:length(b)-1));
    % Predict the third year
    b = [a(3:length(a)) SunDataFuture(i,1) SunDataFuture(i,2)];
    SunDataFuture(i,3) = (1-isErrorLow)*mean(b) + isErrorLow* sum(A.*b(1:length(b)-1));
    % update the progress bar
    waitbar(i/100)
end
close(h)


