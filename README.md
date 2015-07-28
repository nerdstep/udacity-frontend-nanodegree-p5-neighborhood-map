# Udacity Project 5: Neighborhood Map

This project is a single page web application which displays a Google map with a 
filterable list of map markers showing Speakeasy-style cocktail bars in the 
London area.

### [View Project](http://nerdstep.github.io/udacity-project5/dist/)

## Install

**tl;dr**: Clone this repo and run `$ npm install` in that directory to get 
everything setup. The run `$gulp serve` to run the project locally.

-

### Prerequisites

#### [Node.js](https://nodejs.org)

Bring up a terminal and type `node --version`.
Node should respond with a version at or above 0.10.x.
If you require Node, go to [nodejs.org](https://nodejs.org) and click on the big 
green Install button.

#### [Gulp](http://gulpjs.com)

Bring up a terminal and type `gulp --version`.
If Gulp is installed it should return a version number at or above 3.8.x.
If you need to install/upgrade Gulp, open up a terminal and type in the following:

```sh
$ npm install --global gulp
```

*This will install Gulp globally. Depending on your user account, you may need 
to [configure your system](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md) 
to install packages globally without administrative privileges.*

#### Local dependencies

Next, install the dependencies:

```sh
$ npm install
```

That's it! You should now have everything needed to run the project.

-

## Usage

### Watch For Changes & Automatically Refresh Across Devices

```sh
$ gulp serve
```

This outputs an IP address you can use to locally test and another that can be used on devices connected to your network.

### Build & Optimize

```sh
$ gulp
```

Build and optimize the current project, ready for deployment.
This includes linting as well as image, script, stylesheet and HTML optimization and minification.


## References & Credits
- Base project configuration from [Google Web Starter Kit](https://developers.google.com/web/tools/starter-kit/)
- Icon mashed up from the following icons:
  - https://www.iconfinder.com/icons/37950/alcohol_cocktail_icon
  - https://www.iconfinder.com/icons/58512/cocktail_drink_icon
- APIs used:
  - [Google Maps API](https://developers.google.com/maps/documentation/javascript/)
  - [FourSquare API](https://developer.foursquare.com/)
- JavaScript Libraries used:
  - [Underscore.js](http://underscorejs.org/)
  - [Knockout.js](http://knockoutjs.com/)
  - [jQuery](http://jquery.com/)
