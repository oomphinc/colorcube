const WHITE  = tinycolor("#ffffff");
const BLACK  = tinycolor("#000000");
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

function outputRatio(color, ratio, bg, target) {
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
    icontent = '&#x203C;'; // double exclamation
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

  var output =
  `<div class="color-ratio__wrapper ${targetclass} ${passfail}" title="Criteria needed minimum ${target}">
    <p class="color-ratio__label"><strong>${ratio}</strong>: with ${bghex}</p>
    <div class="color-ratio__swatch" style="color: ${hex}; border-color: ${hex}; background-color: ${bghex};">${swatchcontent}</div>
    <p class="color-ratio__results">
      <span class="icon">${icontent}</span>
      <span class="color-ratio__passfail">
        <b>${passfail}</b> ${difference}
      </span>
    </p>
  </div>`;
  return output;
}

function outputAllRatios(color) {
  var ratio_onwhite = getRoundedRatio(color, WHITE),
      ratio_onblack = getRoundedRatio(color, BLACK),
      results = "";
  
  results = 
    `<div class="results__col ratios__on-white">
        ${outputRatio(color, ratio_onwhite, '#fff', AAANORMALRATIO)}
        ${outputRatio(color, ratio_onwhite, '#fff', AANORMALRATIO)}
        ${outputRatio(color, ratio_onwhite, '#fff', AALARGERATIO)}
      </div>
      <div class="results__col ratios__on-black">
        ${outputRatio(color, ratio_onblack, '#000', AAANORMALRATIO)}
        ${outputRatio(color, ratio_onblack, '#000', AANORMALRATIO)}
        ${outputRatio(color, ratio_onblack, '#000', AALARGERATIO)}
      </div>`;
  return results;
}

var button = document.querySelector('#brand-color-button');
button.onclick = function(e) {
  e.preventDefault();

  var resultsBlock = document.getElementById('results-content');
  var results = document.getElementById('results-output');

  // if there are already results displayed, clear them
  if ( results.children.length > 1 ) {
    results.innerHTML = '';
  }

  // Set the header row
  results.innerHTML =
  `<div class="results__row results__row__header">
    <div class="results__col ratios__original">Original</div>
    <div class="results__col ratios__mod"><b>Modify</b></div>
    <div class="results__col ratios__on-white">With white</div>
    <div class="results__col ratios__on-black">With black</div>
    <div class="results__col ratios__most-legible">Most legible from available</div>
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
          <p class="mod__hue"><label for="adjust-hue-${i}">H</label><input type="number" class="adjust-hue" data-target="${i}" data-color="${hex}" id="adjust-hue-${i}" name="adjust-hue-${i}" value="${round(hslColor.h)}" min="0" max="360" /></p>
          <p class="mod__saturation"><label for="adjust-sat-${i}">S</label><input type="number" class="adjust-sat" data-target="${i}" data-color="${hex}" id="adjust-sat-${i}" name="adjust-sat-${i}" value="${decimalToPercent(hslColor.s)}" min="0" max="100" /></p>
          <p class="mod__lightness"><label for="adjust-lig-${i}">L</label><input type="number" class="adjust-lig" data-target="${i}" data-color="${hex}" id="adjust-lig-${i}" name="adjust-lig-${i}" value="${decimalToPercent(hslColor.l)}" min="0" max="100" /></p>
        </div>
      </div>
      <div class="results__row">
        <div id="row-${i}" class="results__row">
          ${outputAllRatios(colorArray[i])}
        </div>
        <div class="results__col ratios__most-legible">
          ${outputRatio(most_legible, ratio_mostlegible, colorArray[i], AAANORMALRATIO)}
          ${outputRatio(most_legible, ratio_mostlegible, colorArray[i], AANORMALRATIO)}
          ${outputRatio(most_legible, ratio_mostlegible, colorArray[i], AALARGERATIO)}
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

// Adjust Hue
$(document).on("change paste keyup blur", ".adjust-hue", function() {
  var target = $(this).data("target"),
      color = $(this).data("color"),
      newValue = $(this).val(),
      originalColor = tinycolor(color).toHsl(),
      newColorHSL = tinycolor("hsl(" + newValue + "," + originalColor.s + ", " + originalColor.l + ")"),
      newColorRAW = newColorHSL.toHex(),
      newColor = newColorHSL.toHexString(),
      targetSwatch = $('.mod-swatch-' + target),
      targetContainer = $('#row-' + target);
  
  // Change the starting color on the inputs, stored in data-color
  var inputs = $("input[data-target=" + target + "]");
  inputs.each(function() {
    $(this).data('color', newColorRAW);
  });
  $('.mod-label-' + target).html(newColor);
  
  // Change the swatch
  targetSwatch.css("background-color", newColor);
  
  // Change the contents of the white/black outputs
  //console.log(newColor);
  targetContainer.html('');
  targetContainer.html(outputAllRatios(newColor));
});

// Adjust Saturation
$(document).on("change paste keyup blur", ".adjust-sat", function() {
  var target = $(this).data("target"),
      color = $(this).data("color"),
      newValue = $(this).val(),
      originalColor = tinycolor(color).toHsl(),
      newColorHSL = tinycolor("hsl(" + originalColor.h + "," + newValue + ", " + originalColor.l + ")"),
      newColorRAW = newColorHSL.toHex(),
      newColor = newColorHSL.toHexString(),
      targetSwatch = $('.mod-swatch-' + target),
      targetContainer = $('#row-' + target);
  
  var inputs = $("input[data-target=" + target + "]");
  inputs.each(function() {
    $(this).data('color', newColorRAW);
  });
  $('.mod-label-' + target).html(newColor);
  
  targetSwatch.css("background-color", newColor);
  //console.log(newColor);
  targetContainer.html('');
  targetContainer.html(outputAllRatios(newColor));
});

// Adjust Lightness
$(document).on("change paste keyup blur", ".adjust-lig", function() {
  var target = $(this).data("target"),
      color = $(this).data("color"),
      newValue = $(this).val(),
      originalColor = tinycolor(color).toHsl(),
      newColorHSL = tinycolor("hsl(" + originalColor.h + "," + originalColor.s + ", " + newValue + ")"),
      newColorRAW = newColorHSL.toHex(),
      newColor = newColorHSL.toHexString(),
      targetSwatch = $('.mod-swatch-' + target),
      targetContainer = $('#row-' + target);
  
  var inputs = $("input[data-target=" + target + "]");
  inputs.each(function() {
    $(this).data('color', newColorRAW);
  });
  $('.mod-label-' + target).html(newColor);
  
  targetSwatch.css("background-color", newColor);
  //console.log(newColor);
  targetContainer.html('');
  targetContainer.html(outputAllRatios(newColor));
});
