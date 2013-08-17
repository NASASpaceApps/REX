# Renewable Energy Explorer (REX) #

## Vision ##

We want to create a renewable energy explorer app that doesn't suck.

We've researched existing solutions. They provide useful data, but their UIs are too complicated.

So, we're creating an app that excites users. We want to provide them with just enough information that will tell them whether they should pursue further research into renewable energy.

Featuring a kick-ass UI, a rating system, "Brownian-walk Monte Carlo" simulation for weather prediction and access to renewable energy experts, our app eases users into the world of renewable energy.


## What We Have ##

[Landing Page Screenshot](https://github.com/NASASpaceApps/REX/blob/master/public/images/SS1.jpg) 

[And a presentation of the application can be found here](http://spaceappschallenge.org/project/rex)

## How to try it ##

Install node and mysql. Clone this repo onto your local drive. Using mysql (as described in the wiki), load the db. Then, In the root of this directory in cmd/terminal, type 'node app.js'. Voila!

## Reading through the code ##

You'll notice that the HTML is handled with a templating engine called Jade. So if you're looking for an 'index.html', you should really be looking for an 'index.jade'.
Just think of it as html without tags. Anything tabbed under a div is contained in the div. You'll pick up on it quickly.

