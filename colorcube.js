const WHITE  = tinycolor("#ffffff");
const BLACK  = tinycolor("#000000");
const AANORMALRATIO = 4.5;
const AALARGERATIO = 3.0;
var colorArray = [];

function getRoundedRatio(color1, color2) {
  var ratio = tinycolor.readability(color1, color2);
  ratio = Math.round(ratio * 10) / 10;
  return ratio;
}

function outputRatio(color, ratio, base, target) {
  var passfail = 'fail',
      output = '',
      iclass = 'times-circle',
      size = 'normal';

  if ( ratio >= (target + 0.5) ) {
    // It passes if the ratio is greater than our constant plus 0.5 for gamma correction
    passfail = 'pass';
    iclass = 'check-circle';
  } else if ( ratio <= (target + 0.5) && ratio > target ) {
    // It barely passes if the ratio is less than our constant plus 0.5 for gamma correction
    // AND greater than the constant. So, within 0.5.
    passfail = 'edge';
    iclass = 'exclamation-triangle';
  }
  if ( target == AALARGERATIO ) {
    size = 'large'
  }

  var output = '<div class="color-ratio__wrapper '+ size +' '+ passfail +'"><div class="color-ratio__swatch" style="color: '+ color +'; border-color: '+ color +'; background-color:' + base + ';">Aa</div><span class="fa fa-' + iclass + '"></span><span class="color-ratio__passfail" title="The target ratio is ' + target + '"><b>' + passfail + '</b> ' + ratio + '</span></div>';
  return output;
}

var button = document.querySelector('#brand-color--button');
button.onclick = function(e) {
  e.preventDefault();

  var results = document.getElementById('results-output');

  // if there are already results displayed, clear them
  if ( results.children.length > 1 ) {
    results.innerHTML = '';
  }

  // Set the header row
  results.innerHTML = '<div class="results__row results__row__header">' +
    '<div class="results__col ratios__original">Original</div>' +
    '<div class="results__col ratios__on-white">With white</div>' +
    '<div class="results__col ratios__on-black">With black</div>' +
    '<div class="results__col ratios__most-legible">Most legible from available</div>' +
  '</div>';

  // get the colors inputted by the user
  var stringInput = document.querySelector('#brand-color--field').value;
  // if there's no input, get outta here
  if ( stringInput == '' ) {
    return;
  }
  // turn it into an array
  colorArray = stringInput.split("\n");

  for (var i = 0; i < colorArray.length; i++) {
    
    // get the color's contrast ratios
    var ratio_onwhite = getRoundedRatio(colorArray[i], WHITE),
        ratio_onblack = getRoundedRatio(colorArray[i], BLACK),
        most_legible = tinycolor.mostReadable(colorArray[i], colorArray),
        ratio_mostlegible = getRoundedRatio(most_legible, colorArray[i]);
    
    // outputRatio( {color & border color}, ratio, {background color}, {ratio to test against} )
    results.innerHTML += '<div class="results__row">' + 
      '<div class="results__col ratios__original">' + 
        '<div class="original__label">' + colorArray[i] + '</div>' + 
        '<div class="original__swatch" style="background-color: ' + colorArray[i] + ';"></div>' + 
      '</div>' + 
      '<div class="results__col ratios__on-white">' + 
        outputRatio(colorArray[i], ratio_onwhite, '#fff', AANORMALRATIO) + 
        outputRatio(colorArray[i], ratio_onwhite, '#fff', AALARGERATIO) + 
      '</div>' + 
      '<div class="results__col ratios__on-black">' + 
        outputRatio(colorArray[i], ratio_onblack, '#000', AANORMALRATIO) + 
        outputRatio(colorArray[i], ratio_onblack, '#000', AALARGERATIO) + 
      '</div>' +
      '<div class="results__col ratios__most-legible">' + 
        outputRatio(most_legible, ratio_mostlegible, colorArray[i], AANORMALRATIO) + 
        outputRatio(most_legible, ratio_mostlegible, colorArray[i], AALARGERATIO) + 
      '</div>';
  }

  // jump to the results
  window.location.href = '#results-content';
  // clear the input field
  //document.querySelector('#brand-color--field').value = '';
}
