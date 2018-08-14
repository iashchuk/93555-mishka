"use strict";

(function() {
  var menuButton = document.querySelector(".navigation__toggle");

  if (menuButton) {
    var siteMenu = document.querySelector(".navigation__site");
    var userMenu = document.querySelector(".navigation__user");

    menuButton.classList.remove("navigation__toggle--off");
    menuButton.classList.add("navigation__toggle--on");
    siteMenu.classList.add("navigation__closed");
    userMenu.classList.add("navigation__closed");

    menuButton.addEventListener('click', function() {
      menuButton.classList.toggle("navigation__toggle--on");
      siteMenu.classList.toggle("navigation__closed");
      userMenu.classList.toggle("navigation__closed");
    });
  }

})();
