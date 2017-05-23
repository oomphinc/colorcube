const WHITE  = tinycolor("#ffffff");
const BLACK  = tinycolor("#000000");
const AARATIO = 4.5;
var colorArray = [];

function getRoundedRatio(color1, color2) {
  var ratio = tinycolor.readability(color1, color2);
      ratio = Math.round(ratio * 10) / 10;
  return ratio;
}

function outputRatio(ratio, div) {
  if ( ratio > (AARATIO + 0.5) ) {
    // if it passes by more than .5, create a green div
    ratioGreen = '<div class="color-ratios--swatch pass">' + ratio + '</div>';
    // and append it
    div.innerHTML = div.innerHTML + ratioGreen;
  } else if ( ratio < (AARATIO + 0.5) && ratio > AARATIO ) {
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
  // get the colors inputted by the user
  var stringInput = document.querySelector('#brand-color--field').value;
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
    // get the first column container
    var div1 = document.getElementsByClassName('color-ratios--column color-ratios--brand-colors')[0];
    // 1) output current color
    div1.innerHTML = div1.innerHTML + '<div class="color-ratios--swatch" style="background-color: ' + colorArray[i] + '"></div>';
    
    // get the color's contrast ratio compared to white
    var ratio = getRoundedRatio(colorArray[i], WHITE);
    // get the second column container
    var div2 = document.getElementsByClassName('color-ratios--column color-ratios--on-white')[0];
    // 2) output a div with that color's ratio on white
    outputRatio(ratio, div2);
    
    // get the color's contrast ratio compared to black
    var ratio = getRoundedRatio(colorArray[i], BLACK);
    // get the third column container
    var div3 = document.getElementsByClassName('color-ratios--column color-ratios--on-black')[0];
    // 3) output a div with that color's ratio on black
    outputRatio(ratio, div3);
    
    // what's most readable with the current color?
    var bestPick = tinycolor.mostReadable(colorArray[i], colorArray);
    // get the color's contrast ratio compared to the best pick
    var ratio = getRoundedRatio(colorArray[i], bestPick['_originalInput'])
    // get the fourth column container
    var div4 = document.getElementsByClassName('color-ratios--column color-ratios--most-legible')[0];
    // 4) from among colors provided, output a div with
    //    the most legible bg-color to pair with the current color
    div4.innerHTML = div4.innerHTML + '<div class="color-ratios--swatch most-legible" style="background-color: ' + bestPick['_originalInput'] + '; color: ' + colorArray[i] + '">' + bestPick['_originalInput'] + '</div>';
    // 4) from among colors provided, output a div with
    //    the ratio between those two colors
    outputRatio(ratio, div4);
  }
}
