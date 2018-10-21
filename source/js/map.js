"use strict";

(function () {

  var contactMap;


  var initMap = function () {
    contactMap = new ymaps.Map('map', {
      center: [59.93878180, 30.32273263],
      zoom: 16,
      controls: ['geolocationControl', 'routeEditor', 'rulerControl']
    });

    var myPlacemark = new ymaps.Placemark([59.93863106, 30.32305450], null, {
      iconLayout: 'default#image',
      iconImageHref: 'img/icon-map-pin.svg',
      iconImageSize: [67, 100],
      iconImageOffset: [-33.5, -100]
    });

    contactMap.geoObjects.add(myPlacemark);
    contactMap.behaviors.disable('scrollZoom');
  }

    ymaps.ready(initMap);

})();
