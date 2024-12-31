let minPrice;
let maxPrice;
let minArea;
let maxArea;

$(document).ready(function () {
  // $('.noUi-handle').on('click', function () {
  //   $(this).width(50);
  // });
  // var rangeSlider = document.getElementById('slider-range');
  // var moneyFormat = wNumb({
  //   decimals: 0,
  //   thousand: ',',
  //   prefix: '₹'
  // });
  // noUiSlider.create(rangeSlider, {
  //   start: [500000, 50000000],
  //   step: 1,
  //   range: {
  //     'min': [500000],
  //     'max': [50000000]
  //   },
  //   format: moneyFormat,
  //   connect: true
  // });
  // // Set visual min and max values and also update value hidden form inputs
  // rangeSlider.noUiSlider.on('update', function (values, handle) {
  //   document.getElementById('slider-range-value1').innerHTML = values[0];
  //   minPrice = values[0];
  //   maxPrice = values[1];
  //   document.getElementById('slider-range-value2').innerHTML = values[1];
  //   document.getElementsByName('min-value').value = moneyFormat.from(
  //     values[0]);
  //   document.getElementsByName('max-value').value = moneyFormat.from(
  //     values[1]);
  // });

  const rangeSlider = document.getElementById("slider-range");

  const moneyFormat = wNumb({
    decimals: 0,
    thousand: ",",
    prefix: "₹",
  });

  noUiSlider.create(rangeSlider, {
    start: [100000, 800000],
    step: 1,
    connect: true,
    tooltips: [true, true],
    range: {
      min: 100000,
      max: 1000000,
    },
    format: moneyFormat,
  });
});
