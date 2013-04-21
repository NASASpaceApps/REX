% NASA Space Challenge
% April 19, 2013
% Toronto, ROM
% Hamid Tizhoosh, Univesity of Waterloo

function SunData = getSunData(numYears)
% This function generates fake dat to simalte weekly iradiance for certain
% regions

n = 1000;   % number of data samples
MyData = []; % initialize the data
numWeeks = 52;

% consider only two regions
RegionType = 2;

if RegionType==1
    MinIrradiance = 10;
    MaxIrradiance = 350;
else 
     MinIrradiance = 50;
    MaxIrradiance = 740;
end

% generate data
for j=1:numYears
    for i=1:numWeeks
        if RegionType==1
            midYear = trimf(i,[5 numWeeks/2 numWeeks-5]);
        else
            midYear = trapmf(i,[1 numWeeks/2-3  numWeeks/2+3 numWeeks]);
        end
        SunData(i,j) = floor(MinIrradiance+(MaxIrradiance-MinIrradiance)*midYear);
        if rand<0.5
            delta = -1*(0.01+0.1*rand)*MaxIrradiance;
        else
            delta = (0.01+0.1*rand)*MaxIrradiance;
        end
        SunData(i,j) = max(0,floor(SunData(i,j) + delta));
    end
end