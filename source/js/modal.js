"use strict";

(function () {

  var buttonOrder = document.querySelector(".hit__button");
  var order = document.querySelector(".order");
  var page = document.querySelector(".page");
  var overlay = document.querySelector(".order__overlay");


  var closeModal = function(evt) {
    if (evt.target === overlay) {
      if (order.classList.contains("order--show")) {
        order.classList.remove("order--show");
        page.removeEventListener("click", closeModal);
        page.removeEventListener("touchstart", closeModal);
      }
    }
  }

  buttonOrder.addEventListener("click", function (evt) {
    var target = evt.target;
    var block = target.parentNode;
    evt.preventDefault();
    order.classList.add("order--show");

    page.addEventListener("click", closeModal);
    page.addEventListener("touchstart", closeModal);
  });


  window.addEventListener("keydown", function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      closeModal();
    }
  });

})();
