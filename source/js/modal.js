"use strict";

(function () {

  var orderButtons = document.querySelectorAll(".order-button");
  var order = document.querySelector(".order");
  var page = document.querySelector(".page");
  var overlay = document.querySelector(".order__overlay");

  var onEscPressButton = function (evt) {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      order.classList.remove("order--show");
    }
  };

  var closeModal = function (evt) {
    if (evt.target === overlay) {
      if (order.classList.contains("order--show")) {
        order.classList.remove("order--show");
        page.removeEventListener("click", closeModal);
        page.removeEventListener("touchstart", closeModal);
        window.removeEventListener("keydown", onEscPressButton);
      }
    }
  };

  var onOrderButtonClick = function (evt) {
    evt.preventDefault();
    order.classList.add("order--show");
    page.addEventListener("click", closeModal);
    page.addEventListener("touchstart", closeModal);
    window.addEventListener("keydown", onEscPressButton);

  };

  for (var i = 0; i < orderButtons.length; i++) {
    orderButtons[i].addEventListener('click', onOrderButtonClick);
  };


})();
