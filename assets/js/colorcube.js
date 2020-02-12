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

function outputRatio(color, ratio, bg, target, editable, iterator) {
  // Default values: AA normal and AAA large with failing grades
  var color = tinycolor(color),
      hex = color.toHexString(),
      background = tinycolor(bg),
      bghex = background.toHexString(),
      passfail = 'fail',
      output = '',
      targetclass = 'target-45',
      icontent = '&#x2718;', // x mark
      swatchcontent = '<p class="level--AA">AA</p><span class="level--AAAplus">AAA</span> 24px',
      difference = 0;

  // Check for passing grades
  if ( ratio >= (target + 0.5) ) {
    // It passes if the ratio is greater than our constant plus 0.5 for gamma correction
    passfail = 'pass';
    icontent = '&#x2714;'; // check mark
  } else if ( ratio <= (target + 0.5) && ratio > target ) {
    // It barely passes if the ratio is less than our constant plus 0.5 for gamma correction
    // AND greater than the constant. So, within 0.5.
    passfail = 'edge';
    icontent = '&#x2714;'; // &#x203C; double exclamation
  }
  
  // Check target ratios
  if ( target == AAANORMALRATIO ) {
    targetclass = 'target-7'
    swatchcontent = '<p class="level--AAA">AAA</p>';
  }
  if ( target == AALARGERATIO ) {
    targetclass = 'target-3'
    swatchcontent = '<span class="level--AAplus">AA</span> 24px';
  }

  difference = round2places( (ratio - target), -1 );
  
  if ( editable === true ) {
    var output =
      `<div class="color-ratio__wrapper ${targetclass} ${passfail}" title="Criteria needed minimum ${target}">
        <p class="color-ratio__label"><strong>${ratio}</strong>: with <input class="cc__form__input adjust-custom" id="test-color-${iterator}" name="test-color-${iterator}" type="text" value="${hex}" data-target="${iterator}" data-color="${bghex}" /></p>
        <div class="color-ratio__swatch color-ratio-swatch-${iterator}" style="color: ${bghex}; border-color: ${bghex}; background-color: ${hex};">${swatchcontent}</div>
        <p class="color-ratio__results">
          <span class="icon">${icontent}</span>
          <span class="color-ratio__passfail">
            <b>${passfail}</b> ${difference}
          </span>
        </p>
      </div>`;
  } else {
    var output =
      `<div class="color-ratio__wrapper ${targetclass} ${passfail}" title="Criteria needed minimum ${target}">
        <p class="color-ratio__label"><strong>${ratio}</strong>: with ${bghex}</p>
        <div class="color-ratio__swatch" style="color: ${bghex}; border-color: ${bghex}; background-color: ${hex};">${swatchcontent}</div>
        <p class="color-ratio__results">
          <span class="icon">${icontent}</span>
          <span class="color-ratio__passfail">
            <b>${passfail}</b> ${difference}
          </span>
        </p>
      </div>`;
  }
  return output;
}

function outputAllRatios(color, light, dark) {
  var ratio_onlight = getRoundedRatio(color, light),
      ratio_ondark = getRoundedRatio(color, dark),
      results = "";
  
  results = 
    `<div class="results__col ratios__on-light">
        ${outputRatio(color, ratio_onlight, light, AAANORMALRATIO)}
        ${outputRatio(color, ratio_onlight, light, AANORMALRATIO)}
        ${outputRatio(color, ratio_onlight, light, AALARGERATIO)}
      </div>
      <div class="results__col ratios__on-dark">
        ${outputRatio(color, ratio_ondark, dark, AAANORMALRATIO)}
        ${outputRatio(color, ratio_ondark, dark, AANORMALRATIO)}
        ${outputRatio(color, ratio_ondark, dark, AALARGERATIO)}
      </div>`;
  return results;
}

function outputCustomRatios(color, ratio, bg, iterator) {
  var results = outputRatio(color, ratio, bg, AAANORMALRATIO, true, iterator);
  results = results + outputRatio(color, ratio, bg, AANORMALRATIO, true, iterator);
  results = results + outputRatio(color, ratio, bg, AALARGERATIO, true, iterator);
  return results;
}

var button = document.querySelector('#brand-color-button');
button.onclick = function(e) {
  e.preventDefault();

  var resultsBlock = document.getElementById('results-content'),
      results = document.getElementById('results-output'),
      white = tinycolor(document.querySelector('#white-value').value),
      black = tinycolor(document.querySelector('#black-value').value);

  // if there are already results displayed, clear them
  if ( results.children.length > 1 ) {
    results.innerHTML = '';
  }

  // Set the header row
  results.innerHTML =
  `<div class="results__row results__row__header">
    <div class="results__col ratios__original">Original</div>
    <div class="results__col ratios__mod"><b>Modify</b></div>
    <div class="results__col ratios__on-light">With light</div>
    <div class="results__col ratios__on-dark">With dark</div>
    <div class="results__col ratios__custom">Most legible or Custom</div>
  </div>`;

  // get the colors inputted by the user
  var stringInput = document.querySelector('#brand-color-field').value;
  // if there's no input, get outta here
  if ( stringInput == '' ) {
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
    `<div class="results__row">
      <div class="results__col ratios__original">
        <p class="original__label">${hashhex}</p>
        <div class="original__hsl">
          <p title="Hue"><b>H:</b> ${round(hslColor.h)}</p>
          <p title="Saturation"><b>S:</b> ${decimalToPercent(hslColor.s)}</p>
          <p title="Lightness"><b>L:</b> ${decimalToPercent(hslColor.l)}</p>
        </div>
        <div class="original__swatch" style="background-color: ${hashhex};"></div>
      </div>
      <div class="results__col ratios__mod">
        <p class="mod__label mod-label-${i}">${hashhex}</p>
        <div class="mod__swatch mod-swatch-${i}" style="background-color: ${hashhex};"></div>
        <div class="mod__controls">
          <p class="mod__hue"><label for="adjust-hue-${i}">H</label><input type="number" class="cc__form__input adjust-hue" data-target="${i}" data-color="${hex}" id="adjust-hue-${i}" name="adjust-hue-${i}" value="${round(hslColor.h)}" min="0" max="360" /></p>
          <p class="mod__saturation"><label for="adjust-sat-${i}">S</label><input type="number" class="cc__form__input adjust-sat" data-target="${i}" data-color="${hex}" id="adjust-sat-${i}" name="adjust-sat-${i}" value="${decimalToPercent(hslColor.s)}" min="0" max="100" /></p>
          <p class="mod__lightness"><label for="adjust-lig-${i}">L</label><input type="number" class="cc__form__input adjust-lig" data-target="${i}" data-color="${hex}" id="adjust-lig-${i}" name="adjust-lig-${i}" value="${decimalToPercent(hslColor.l)}" min="0" max="100" /></p>
        </div>
      </div>
      <div class="results__row">
        <div id="row-${i}" class="results__row">
          ${outputAllRatios(colorArray[i], white, black)}
        </div>
        <div id="custom-pair-${i}" class="results__col ratios__custom">
          ${outputCustomRatios(most_legible, ratio_mostlegible, colorArray[i], i)}
        </div>
      </div>
    </div>`;
  }

  // make the results content visible
  resultsBlock.style.display = 'block';
  resultsBlock.style.visibility = 'visible';

  // jump to the results
  window.location.href = '#results-content';
}

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
      targetSwatch = $('.mod-swatch-' + target),
      targetContainer = $('#row-' + target),
      customContainer = $('#custom-pair-' + target),
      white = tinycolor(document.querySelector('#white-value').value),
      black = tinycolor(document.querySelector('#black-value').value),
      custom = tinycolor(document.querySelector('#test-color-' + target).value),
      ratio_custom = getRoundedRatio(custom, newColor);
  
  // Change the starting color on the inputs, stored in data-color
  var inputs = $("input[data-target=" + target + "]");
  inputs.each(function() {
    $(this).data('color', newColorRAW);
  });
  $('.mod-label-' + target).html(newColor);
  
  // Change the swatch
  targetSwatch.css("background-color", newColor);
  
  // Change the contents of the light/dark outputs
  //console.log(newColor);
  targetContainer.html('');
  targetContainer.html(outputAllRatios(newColor, white, black));
  
  // Change the contents of the Custom column
  customContainer.html('');
  customContainer.html(outputCustomRatios(custom, ratio_custom, newColor, target));
});

// If a custom color is supplied, redo the custom color test
$(document).on("blur", ".adjust-custom", function() {
  var target = $(this).data("target"),
      color = tinycolor($(this).data("color")),
      newColor = tinycolor($(this).val()),
      ratio_custom = getRoundedRatio(color, newColor),
      customContainer = $('#custom-pair-' + target);
  
  // Change the contents of the Custom column
  customContainer.html('');
  customContainer.html(outputCustomRatios(newColor, ratio_custom, color, target));
});
