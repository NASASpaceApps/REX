% NASA Space Challenge
% April 19, 2013
% Toronto, ROM
% Hamid Tizhoosh, Univesity of Waterloo

function [A,maxError] = estimateFuncParam(Values)
% This function estimates the parameters of a function that reperesents the
% numbes in Values. 

% how many numbers?
[n] = length(Values);

% Global setting
maxError = 1e9; % initial error
maxIter = 500; % maximum number of iteartions, the more the higher the accuracy
errorTolerance = 0.1; % accepatble error rate
numIter = 0; % initialize number of iteartions

% start the estimation loop
while (maxError > errorTolerance)
    % one more iteration
    numIter = numIter +1;
    % stop if max number of iterations already done
    if numIter>maxIter break; end
    % initialize sum
    S = 0;
    % make a guess
    for j=1:n-1
        A(j) = rand;
        S = S + A(j)*Values(j);
    end
    % look at the opposite guess
    OA = 1 - A;
    OS = sum(OA.*Values(1:n-1));

    % which one is a better estimate: guess or opposite guess?
    if ( abs(S - Values(n)) < abs(OS - Values(n)) )
        thisError = abs(S - Values(n));
        bestA = A;
    else
        thisError = abs(OS - Values(n));
        bestA = OA;
    end
    % upadte teh error
    if thisError<maxError
        maxError = thisError;
    end
end