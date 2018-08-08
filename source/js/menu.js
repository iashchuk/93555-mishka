"use strict";

(function() {
var menuButton = document.querySelector(".navigation__toggle");

if (menuButton) {
  var menu = document.querySelector(".menu");

  menuButton.classList.remove("navigation__toggle--off");
  menuButton.classList.add("navigation__toggle--on");
  menu.classList.add("menu--closed");

  menuButton.onclick = function() {
    menuButton.classList.toggle("navigation__toggle--on");
    menu.classList.toggle("menu--closed");
  };
}
})();
