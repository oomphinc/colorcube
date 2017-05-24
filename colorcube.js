const WHITE  = tinycolor("#ffffff");
const BLACK  = tinycolor("#000000");
const LARGETEXTAARATIO = 3.1;
var colorArray = [];

function getRoundedRatio(color1, color2) {
  var ratio = tinycolor.readability(color1, color2);
      ratio = Math.round(ratio * 10) / 10;
  return ratio;
}

function outputRatio(ratio, div) {
  if ( ratio > (LARGETEXTAARATIO + 0.5) ) {
    // if it passes by more than .5, create a green div
    ratioGreen = '<div class="color-ratios--swatch pass">' + ratio + '</div>';
    // and append it
    div.innerHTML = div.innerHTML + ratioGreen;
  } else if ( ratio < (LARGETEXTAARATIO + 0.5) && ratio > LARGETEXTAARATIO ) {
    // if it barely passes, create a yellow div
    ratioYellow = '<div class="color-ratios--swatch edge">' + ratio + '</div>';
    // and append it
    div.innerHTML = div.innerHTML + ratioYellow;
  } else {
    // if it fails by more than .5, create a red div
    ratioRed = '<div class="color-ratios--swatch fail">' + ratio + '</div>';
    // and append it
    div.innerHTML = div.innerHTML + ratioRed;
  }
}

var button = document.querySelector('#brand-color--button');
button.onclick = function(e) {
  e.preventDefault();
  // get each of the four columns where we will be outputting results
  var column1 = document.getElementsByClassName('color-ratios--column color-ratios--brand-colors')[0];
  var column2 = document.getElementsByClassName('color-ratios--column color-ratios--on-white')[0];
  var column3 = document.getElementsByClassName('color-ratios--column color-ratios--on-black')[0];
  var column4 = document.getElementsByClassName('color-ratios--column color-ratios--most-legible')[0];

  // if there are already results displayed, clear them
  if ( column1.children.length > 1 ) {
    column1.innerHTML = '<h4 class="color-ratios--title">Brand Color</h4>';
    column2.innerHTML = '<h4 class="color-ratios--title">With White</h4>';
    column3.innerHTML = '<h4 class="color-ratios--title">With Black</h4>';
    column4.innerHTML = '<h4 class="color-ratios--title">Most Readable Pair</h4>';
  }
  
  // get the colors inputted by the user
  var stringInput = document.querySelector('#brand-color--field').value;
  // if there's no input, get outta here
  if ( stringInput == '' ) {
    return;
  }
  // turn it into an array
  colorArray = stringInput.split("\n");
  
  // for each value in the array of user-inputted colors
  // 1) output a div with the current color
  // 2) output a div with that color's ratio on white
  // 3) output a div with that color's ratio on black
  // 4) from among colors provided, output a div with
  //        a) the most legible bg-color to pair with the current color
  //        b) the ratio between those two colors
  for (var i = 0; i < colorArray.length; i++) {
    // 1) output current color
    column1.innerHTML = column1.innerHTML + '<div class="color-ratios--swatch" style="background-color: ' + colorArray[i] + '"></div>';
    
    // get the color's contrast ratio compared to white
    var ratio = getRoundedRatio(colorArray[i], WHITE);
    // 2) output a div with that color's ratio on white
    outputRatio(ratio, column2);
    
    // get the color's contrast ratio compared to black
    var ratio = getRoundedRatio(colorArray[i], BLACK);
    // 3) output a div with that color's ratio on black
    outputRatio(ratio, column3);
    
    // what's most readable with the current color?
    var bestPick = tinycolor.mostReadable(colorArray[i], colorArray);
    // get the color's contrast ratio compared to the best pick
    var ratio = getRoundedRatio(colorArray[i], bestPick['_originalInput'])
    // 4) from among colors provided, output a div with
    //    the most legible bg-color to pair with the current color
    column4.innerHTML = column4.innerHTML + '<div class="color-ratios--swatch most-legible" style="background-color: ' + colorArray[i] + '; color: ' + bestPick['_originalInput'] + '">' + bestPick['_originalInput'] + '</div>';
    // 4) from among colors provided, output a div with
    //    the ratio between those two colors
    outputRatio(ratio, column4);
  }
  // jump to the results
  window.location.href = '#results-content';
  // clear the input field
  document.querySelector('#brand-color--field').value = '';
}
