% Editor : Sayed Abulhasan Quadri , Research associate in CEDEC , 
% Research Domain : Multisensor data fusion and Artificial Intelligence 
% This tutorial  will show  the practical implementation of the curve fitting schemes
% First we learn  Leastsquare method , then  polynomial fits, line interpolation, and spline interpolation. 
% To begin the data fit process, we first import a relevant data set into the
% MATLAB environment. To do so, the load command is used. The file gyro.dat (data from gyroscope) 
% is a collection of x and y data values put into a two column format separated by spaces.
% If you want any other data to be fit , just edit gyro.dat file .
% % Fitting  the gyroscope data 
disp('***Please Read comments provided in the code to understand better*** ')
load gyro.dat
x=gyro(:,1);
y=gyro(:,2);
% After reading in the data, the two vectors x and y are created from the first
% and second column of the data respectively. It is this set of data which will be
% explored with line fitting techniques. The code will also generate a plot of the
% data in figure 1 of MATLAB.

figure(1), plot(x,y,'o:')

title('Simple plot of gyroscope data  ');

% Now let us see "Least-Squares Fitting"
% The least-squares fit technique is considered first. The polyfit and polyval
% commands are essential to this method. Specifically, the polyfit command is
% used to generate the n + 1 coefficients aj of the nth-degree polynomial
% pn(x) = anxn + an?1xn?1 +    + a1x + a0 
% which is used for fitting the data. The basic structure requires that the vectors x and y
% be submitted to polyval along with the desired degree of polynomial fit n. To
% fit a line (n = 1) through the data, the structure, use the command
% pcoeff=polyfit(x,y,1);
% The output of this function call is a vector pcoeff which includes the coefficients
% a1 and a0 of the line fit p1(x) = a1x+a0. To evaluate and plot this line, values
% of x must be chosen. For this example, the line will be plotted for x belongs to [0, 7] in
% steps of delta x = 0.1.
% xp=0:0.1:7;
% yp=polyval(pcoeff,xp);
% figure(2), plot(x,y,O,xp,yp,'m')
% 
% The polyval command uses the coefficients generated from polyfit to generate
% the y?values of the polynomial fit at the desired values of x given by xp. Figure
% 2 i depicts both the data and the best line fit in the least-square sense.

pcoeff=polyfit(x,y,1);
xp=0:0.1:5;
yp=polyval(pcoeff,xp);
figure(2), plot(x,y,'o',xp,yp,'m')
title('Least square fit of gyroscope data  ');

% .................................................
% Now, To fit a Parabolic profile through the data, a second degree polynomial is
% used. This is generated with
% pcoeff2=polyfit(x,y,2);
% yp2=polyval(pcoeff2,xp);
% figure(3), plot(x,y,O,xp,yp2,m)
% 
% Here the vector yp2 contains the parabolic fit to the data evaluated at the
% x-values xp. These results are plotted in MATLAB figure 3. To find the leastsquare
% error, the sum of the squares of the differences between the parabolic fit
% and the actualy data must be evaluated. Specifically, the quantity:
% 
% E2(f) =(1/n summation |abs f(xk) - yk square|)square 1/2
% 
% is calculated. For the parabolic fit considered in the last example, the polynomial
% fit must be evaluated at the x?values for the given data linefit.dat. The error
% is then calculated
% yp3=polyval(pcoeff2,x);
% E2=sqrt( sum( ( abs(yp3-y) ).^2 )/n )
% In general, the error will continue to drop as the degree of polynomial
% is increased. this is because every extra degree of freedom allows for a better
% least-squares fit to the data.

pcoeff2=polyfit(x,y,2);
yp2=polyval(pcoeff2,xp);
figure(3), plot(x,y,'O',xp,yp2,'m')
title('Parabolic Profile  fit of gyroscope data  ');
% ............................................

% Now learn "Interpolation"
% In addition to least-square fitting, interpolation techniques can be developed
% which go through all the given data points. The error in this case is zero, but
% each interpolation scheme must be evaluated for its accurate representation of
% the data. The first interpolation scheme is a polynomial fit to the data. Given
% n+1 points, an nth degree polynomial is chosen. The polyfit command is again
% used for the calculation
% n=length(x)-1;
% pcoeffn=polyfit(x,y,n);
% ypn=polyval(pcoeffn,xp);
% figure(4), plot(x,y,O,xp,ypn,m)
% The MATLAB script will produce an nth degree polynomial through the data
% points. But as always is the danger with polynomial interpolation, polynomial
% wiggle can dominate the behavior. This is  illustrated in figure 4.
% The strong oscillatory phenomena at the edges is a common feature of
% this type of interpolation.

n=length(x)-1;
pcoeffn=polyfit(x,y,n);
ypn=polyval(pcoeffn,xp);
figure(4), plot(x,y,'O',xp,ypn,'m')
title(' Gyroscope data fit using interpolation technique');

% .........................................
% Now see  piecewise linear fit:
% In contrast to a polynomial fit, a piecewise linear fit gives a simple minded
% connect-the-dot interpolation to the data. The interp1 command gives the
% piecewise linear fit algorithm
% yint=interp1(x,y,xp);
% figure(5), plot(x,y,O,xp,yint,'m')
% The linear interpolation is illustrated in figure 5. 
yint=interp1(x,y,xp);
 figure(5), plot(x,y,'O',xp,yint,'m')
 title(' Piecewise linear fit');

% ..............................................................
% There are a few options available with the interp1 command, including the nearest option and
% the spline option. The nearest option gives the nearest value of the data to the
% interpolated value while the spline option gives a cubic spline fit interpolation
% to the data. The two options can be compared with the default linear option.
% yint=interp1(x,y,xp);
% yint2=interp1(x,y,xp,nearest)
% yint3=interp1(x,y,xp,spline)
% figure(6), plot(x,y,O,xp,yint,m,xp,int2,k,xp,int3,r)

% yint=interp1(x,y,xp);
% yint2=interp1(x,y,xp,'nearest');
% yint3=interp1(x,y,xp,'spline');
% figure(6), plot(x,y,'O',xp,yint,'m',xp,int2,'k',xp,int3,'r')
%  title(' piecewise linear fit including nearest and spline option');
 % .......................................
%  Fit Using the spline option is equivalent to using the spline algorithm supplied
% by MATLAB. Thus a smooth fit can be achieved with either spline or interp1.
% The spline command is used by giving the x and y data along with a vector
% xp for which we desire to generate corresponding y?values.
% yspline=spline(x,y,xp);
% figure(6), plot(x,y,O,xp,yspline,k)
 
yspline=spline(x,y,xp);
figure(6), plot(x,y,'O',xp,yspline,'k')
 title(' Fit using Spline command ');