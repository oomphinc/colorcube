const AAANORMALRATIO = 7.0;
const AANORMALRATIO = 4.5;
const AALARGERATIO = 3.0;
var colorArray = [];

// Decimal Rounding: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // If the value is negative...
    if (value < 0) {
      return -decimalAdjust(type, -value, exp);
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

function round(number) {
  return Math.round(number);
}

// Preserves a place after the decimal
function round2places(number) {
  return (Math.round(number * 100) / 100).toFixed(2);
}

function decimalToPercent(number) {
  return Math.round(number * 100);
}

function getRoundedRatio(color1, color2) {
  var ratio = tinycolor.readability(color1, color2);
  return round2places(ratio);
}

function outputLevelTest(ratio, target) {
  // Default values: AA normal and AAA large with failing grades
  var passfail = 'failure',
      passfail_conforms = 'Does not Conform',
      passfail_message = '<dd role="text">4.5 <span class="u__sr-only">is required for WCAG Level AA for small text and Level AAA for large text</span><span aria-hidden="true"> AA/AAA lg</span></dd>',
      output = '';

  // Check for passing grades
  // It passes if the ratio is greater than our constant plus 0.5 for gamma correction
  //if ( ratio >= (target + 0.5) ) {
  if ( ratio >= target ) {
    passfail = 'success';
    passfail_conforms = 'Conforms';
  }

  // Check levels
  if ( target == AAANORMALRATIO ) {
    passfail_message = '<dd role="text">7.0 <span class="u__sr-only">is required for WCAG Level</span> AAA</dd>';
  }
  if ( target == AALARGERATIO ) {
    passfail_message = '<dd role="text">3.0 <span class="u__sr-only">is required for WCAG Level AA for large text</span><span aria-hidden="true"> AA lg</span></dd>';
  }

  var output =
    `<dt><svg class="conformance__${passfail}"><use xlink:href="#${passfail}" /></svg><span class="u__sr-only">${passfail_conforms}</span></dt>
            ${passfail_message}`;
  return output;
}

function outputColorRow(color, bg, editable, iterator) {
  // Default values: AA normal and AAA large with failing grades
  var color = tinycolor(color),
      hex = color.toHexString(),
      background = tinycolor(bg),
      bghex = background.toHexString(),
      ratio = getRoundedRatio(color, background),
      //targetclass = 'target-45',
      totalfail = '';

  // If this ratio is less than 3, it is a total failure
  if ( ratio < 3 ) {
    totalfail = ' swatch--total-fail';
  }

  if ( editable === true ) {
    var output =
      `<div class="results__col">
        <div class="swatch${totalfail}" style="background-color: ${hex}">
          <span class="swatch__ratio" style="color: ${bghex}">${ratio}</span>
        </div>
        <div class="results__details">
          <p><span>With </span><input class="form__input adjust-custom" id="custom-color-${iterator}" name="custom-color-${iterator}" type="text" value="${bghex}" data-target="${iterator}" data-color="${hex}"></p>
          <dl>
            ${outputLevelTest(ratio, AAANORMALRATIO)}
            ${outputLevelTest(ratio, AANORMALRATIO)}
            ${outputLevelTest(ratio, AALARGERATIO)}
          </dl>
        </div>
      </div>`;
  } else {
    var output =
      `<div class="results__col">
        <div class="swatch${totalfail}" style="background-color: ${hex}">
          <span class="swatch__ratio " style="color: ${bghex}">${ratio}</span>
        </div>
        <div class="results__details">
          <p>With <a href="#adjust-defaults" class="js-jump-tab">${bghex}</a></p>
          <dl>
            ${outputLevelTest(ratio, AAANORMALRATIO)}
            ${outputLevelTest(ratio, AANORMALRATIO)}
            ${outputLevelTest(ratio, AALARGERATIO)}
          </dl>
        </div>
      </div>`;
  }
  return output;
}

$('.js-get-ratios').click( function(e) {
  console.log('Get Ratios clicked');
  e.preventDefault();

  var results = document.getElementById('js-results-output'),
      white = tinycolor(document.querySelector('#white-value').value),
      black = tinycolor(document.querySelector('#black-value').value);

  // if there are already results displayed, clear them
  if ( results && results.children.length > 0 ) {
    results.innerHTML = '';
  }

  // get the colors inputted by the user
  var stringInput = document.querySelector('#brand-color-field').value;
  // if there's no input, get outta here
  if ( stringInput == '' ) {
    // TODO: Add a message about the textarea being empty
    return;
  }
  // turn it into an array
  colorArray = stringInput.split("\n");

  for (var i = 0; i < colorArray.length; i++) {

    // get the color's contrast ratios
    var most_legible = tinycolor.mostReadable(colorArray[i], colorArray),
        ratio_mostlegible = getRoundedRatio(most_legible, colorArray[i]),
        color = tinycolor(colorArray[i]),
        hex = color.toHex(),
        hashhex = color.toHexString(),
        hslColor = color.toHsl();

    // outputRatio( {color & border color}, ratio, {background color}, {ratio to test against} )
    results.innerHTML +=
    `<li class="results__item">
    <h3 id="js-mod-label-${i}" class="results__title"><span class="js-orig-label-${i}">${hashhex}</span> <span class="js-mod-label-${i}"></span></h3>
    <div class="results__row hsl">
      <div class="hsl__original">
        <div class="swatch swatch--half" style="background-color: ${hashhex}"></div>
        <p><b><a href="#modify" class="js-jump-tab">HSL</a></b> ${round(hslColor.h)}, ${decimalToPercent(hslColor.s)}%, ${decimalToPercent(hslColor.l)}%</p>
      </div>
      <div class="hsl__mod">
        <div class="swatch swatch--half js-mod-swatch-${i}" style="background-color: ${hashhex}"></div>
        <p class="hsl__controls">
          <span class="hsl__hue">
            <label class="u__sr-only" for="adjust-hue-${i}">H</label>
            <input type="number" class="form__input adjust-hue"
              data-target="${i}" data-color="${hex}" id="adjust-hue-${i}" name="adjust-hue-${i}" value="${round(hslColor.h)}" min="0" max="360">
          </span>
          <span class="hsl__saturation">
            <label class="u__sr-only" for="adjust-sat-${i}">S</label>
            <input type="number" class="form__input adjust-sat"
              data-target="${i}" data-color="${hex}" id="adjust-sat-${i}" name="adjust-sat-${i}" value="${decimalToPercent(hslColor.s)}" min="0" max="100">
          </span>
          <span class="hsl__lightness">
            <label class="u__sr-only" for="adjust-lig-${i}">L</label>
            <input type="number" class="form__input adjust-lig"
              data-target="${i}" data-color="${hex}" id="adjust-lig-${i}" name="adjust-lig-${i}" value="${decimalToPercent(hslColor.l)}" min="0" max="100">
          </span>
        </p>
      </div>
    </div>
    <div id="results-${i}" class="results__row__wrapper">
      <div class="results__row results--w-light">
        ${outputColorRow(colorArray[i], white)}
      </div>
      <div class="results__row results--w-dark">
        ${outputColorRow(colorArray[i], black)}
      </div>
      <div class="results__row results--w-custom" id="custom-pair-${i}">
        ${outputColorRow(colorArray[i], most_legible, true, i)}
      </div>
    </div>
  </li>`;
  }

  // Trigger a results tab click to switch to the ratios pane
  const resultsButton = $('#ratio');
  resultsButton.click();
});

// Adjust Hue, Saturation, or Lightness
$(document).on("change paste keyup blur", ".adjust-hue, .adjust-sat, .adjust-lig", function() {
  var target = $(this).data("target"),
      color = $(this).data("color"),
      newValue = $(this).val(),
      originalColor = tinycolor(color).toHsl(),
      newColorHSL = '';

  // Adjust the color based on the class of the input
  if ( $(this).hasClass('adjust-hue') ) {
    newColorHSL = tinycolor("hsl(" + newValue + "," + originalColor.s + ", " + originalColor.l + ")");
  } else if ( $(this).hasClass('adjust-sat') ) {
    newColorHSL = tinycolor("hsl(" + originalColor.h + "," + newValue + ", " + originalColor.l + ")");
  } else {
    newColorHSL = tinycolor("hsl(" + originalColor.h + "," + originalColor.s + ", " + newValue + ")");
  }

  var newColorRAW = newColorHSL.toHex(),
      newColor = newColorHSL.toHexString(),
      targetSwatch = $('.js-mod-swatch-' + target),
      targetContainer = $('#results-' + target),
      white = tinycolor(document.querySelector('#white-value').value),
      black = tinycolor(document.querySelector('#black-value').value),
      custom = tinycolor(document.querySelector('#custom-color-' + target).value);

  // Change the starting color on the inputs, stored in data-color
  var inputs = $("input[data-target=" + target + "]");
  inputs.each(function() {
    $(this).data('color', newColorRAW);
  });
  $('.js-mod-label-' + target).html(newColor);
  $('.js-orig-label-' + target).addClass('--modified');

  // Change the swatch
  targetSwatch.css("background-color", newColor);

  // Change the contents of the results with the new color
  targetContainer.html('');
  var newResults =
    `<div class="results__row results--w-light">
        ${outputColorRow(newColor, white)}
      </div>
      <div class="results__row results--w-dark">
        ${outputColorRow(newColor, black)}
      </div>
      <div class="results__row results--w-custom" id="custom-pair-${target}">
        ${outputColorRow(newColor, custom, true, target)}
      </div>`;
  //console.log(newColor);
  targetContainer.html(newResults);
});

// If a custom color is supplied, redo the custom color test
$(document).on("blur", ".adjust-custom", function() {
  var target = $(this).data("target"),
      color = tinycolor($(this).data("color")),
      newColor = tinycolor($(this).val()),
      customContainer = $('#custom-pair-' + target);

  // Change the contents of the Custom column
  customContainer.html('');
  var newResults = `${outputColorRow(color, newColor, true, target)}`;
  customContainer.html(newResults);
});
