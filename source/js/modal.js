"use strict";

(function () {

  var buttonOrder = document.querySelector(".hit__button");
  var order = document.querySelector(".order");

  buttonOrder.addEventListener("click", function (evt) {
    evt.preventDefault();
    order.classList.add("order--show");
  });


  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      if (order.classList.contains("order--show")) {
        order.classList.remove("order--show");
      }
    }
  });

})();
