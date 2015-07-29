/**
 * Main application script
 * Author: Justin Williams @jwilliams42
 */

(function () {
  'use strict';

  var markerTpl = _.template($('#info-template').html());
  var center = { lat: 51.50722, lng: -0.12750 };
  var prevInfoWindow;

  // array of places to add to map
  var places = [{
    name: 'PortSide Parlour',
    desc: 'Underground rum bar with a vintage vibe',
    area: 'Shoreditch',
    lat: 51.5260588,
    lng: -0.0825125,
    venueId: '510adae3e4b06d6c3963fd4e'
  },{
    name: 'Callooh Callay',
    desc: 'Quirky cocktail bar with eccentric decor',
    area: 'Shoreditch',
    lat: 51.5262197,
    lng: -0.0799042,
    venueId: '4ad906d3f964a520421721e3'
  },{
    name: 'Evans & Peel Detective Agency',
    desc: 'Speakeasy disguised as a detective agency',
    area: 'Earls Court',
    lat: 51.49,
    lng: -0.191089,
    venueId: '4fd789d1e4b0884f34d5383b'
  },{
    name: 'Purl Cocktail Bar',
    desc: 'Prohibition-style basement cocktail bar',
    area: 'Marylebone',
    lat: 51.5184213,
    lng: -0.1544306,
    venueId: '4c0abc1a009a0f479cf6e9bf'
  },{
    name: 'The Nightjar',
    desc: 'Prohibition-style cocktail bar',
    area: 'Shoreditch',
    lat: 51.5265314,
    lng: -0.0877565,
    venueId: '4c9a25e613de95212f13d653'
  },{
    name: 'The Mayor of Scaredy Cat Town',
    desc: 'Secret cocktail bar behind fridge door',
    area: 'Bishopsgate',
    lat: 51.5183648,
    lng: -0.078791,
    venueId: '4ddbe73518388dd6923c79ee'
  }];


  // This function queries the FourSquare API to retrieve venue information
  // it caches the response in localStorage so we don't hit the API too often
  // NOTE: Yes, unfortunately we are exposing our secret API key here;
  // ideally we'd implement a server side proxy to call instead
  function getFourSquareVenue(venueId, callback, forceGet) {
    var store = window.localStorage;
    var clientId = 'T0PWJ4SYX4R3ZBEFRGORWFTVNQ3QOKV5Q5CJLQX5KGOWDV0W';
    var secretId = 'LAFWQ31MQHSYY2E52C2QEUBCRFREBAUART5CXNXDNTDHSO5G';
    var apiUrl = 'https://api.foursquare.com/v2/venues/'+venueId+'?v=20150722&client_id='+clientId+'&client_secret='+secretId;
    // check if the venue has been saved to localStorage
    var data = store ? store.getItem(venueId) : undefined;

    if (data && !forceGet) {
      callback(JSON.parse(data));
    } else {
      $.getJSON(apiUrl, function (res) {
        console.log('get', res);
        if (res.meta.code === 200) {
          // save response to localStorage for future lookup
          if (store) {
            store.setItem(venueId, JSON.stringify(res.response.venue));
          }
          callback(res.response.venue);
        } else {
          // handle response other than 200
          console.log('Oops, looks like something went wrong.', res);
          alert('FourSquare API Error: ' + res.meta.code + ' (see console output)');
        }
      }).fail(function(jqXHR, textStatus, error) {
        console.log('AJAX Error', jqXHR, textStatus, error);
        alert('Ajax Request Failed: ' + textStatus);
      });
    }
  }


  var Marker = function Marker(obj, map) {
    var _this = this;
    var infowindow;

    //console.log(obj);

    _this.name = ko.observable(obj.name);
    _this.desc = ko.observable(obj.desc);
    _this.area = ko.observable(obj.area);
    _this.lat  = ko.observable(obj.lat);
    _this.lng  = ko.observable(obj.lng);
    _this.venueId = ko.observable(obj.venueId);

    _this.removeMarker = function () {
      _this.marker.setMap(null);
    };

    _this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(obj.lat, obj.lng),
      animation: google.maps.Animation.DROP,
      title: obj.name,
      icon: 'images/cocktail.png',
      map: map
    });

    _this.openInfoWindow = function () {
      // if a previous info window was set then close it first
      if (prevInfoWindow) {
        prevInfoWindow.close();
      }

      getFourSquareVenue(_this.venueId(), function (data) {

        // extend our data object with the fourSquare venue data
        _.extend(obj, data);

        console.log('venue', obj);

        // create an InfoWindow for the marker
        if (!infowindow) {
          infowindow = new google.maps.InfoWindow({
            content: markerTpl(obj)
          });
        }

        // center map on marker
        map.setCenter(_this.marker.getPosition()); // setCenter takes a LatLng object

        infowindow.open(map, _this.marker);

        // remember this info window as the prev info window
        prevInfoWindow = infowindow;
      });
    };

    google.maps.event.addListener(_this.marker, 'click', function() {
      _this.openInfoWindow();
    });

    return _this;
  };


  function MapViewModel(places) {
    var _this = this;

    // get a list of unique area names
    var areas = _.chain(places).pluck('area').unique().sortBy().value();
    areas.unshift('All');

    _this.places = ko.observableArray(places);
    _this.areas = ko.observableArray(areas);
    _this.markers = ko.observableArray();

    // This creates a new instance of a Google map
    _this.createMap = function (lat, lng) {
      var mapOptions = {
        zoom: 13,
        center: { lat: lat, lng: lng },
        mapTypeId: 'terrain'
      };
      return new google.maps.Map($('#map-canvas')[0], mapOptions);
    };

    // This function adds a new map marker model to the map
    _this.addMarker = function (item) {
      var marker = new Marker(item, _this.map);
      _this.markers.push(marker);
      return marker;
    };

    // This function adds a list of places as markers to the map
    _this.addMarkers = function (list) {
      list = list || [];

      _.each(list, function (item, i) {
        _.delay(_this.addMarker, i * 100, item);
      });

      // get the first marker from the array and center on it
      // this way each time an area is selected we are centered on the map
      _.defer(function () {
        var m = _this.markers()[0];
        if (m) {
          _this.map.setCenter(m.marker.getPosition());
        }
      });
    };

    // This function removes all of the current markers on the map
    _this.removeMarkers = function () {
      _.each(_this.markers(), function (marker) {
        marker.removeMarker();
      });

      _this.markers.removeAll();

      google.maps.event.clearListeners(_this.map, 'bounds_changed');
    };

    // filter our places list for values that match a given area name
    _this.filterArea = function (name) {
      var list = [];
      //console.log('filter', area);

      // first remove all of the markers from the map
      _this.removeMarkers();

      // if the value is 'All' then put all of the markers back on the map
      // otherwise filter the places list
      if (name === 'All') {
        _this.addMarkers(places);
      } else {

        list = _.filter(places, function (item) {
          return item.area === name;
        });

        // add the filtered list to the map
        _this.addMarkers(list);
      }
    };

    _this.filterPlace = function (place) {
      _this.removeMarkers();
      var m = _this.addMarker(place);
      m.openInfoWindow();
    };

    // create a new Google map
    _this.map = _this.createMap(center.lat, center.lng);

    _this.addMarkers(places);
  }

  ko.applyBindings(new MapViewModel(places));

})();
